import { defineStore } from 'pinia'
import { FUGGLERS, getShopProbabilities } from '../data/fugglerPedia'

export const useGameStore = defineStore('game', {
  state: () => ({
    round: 0,
    phase: 'IDLE', // IDLE, PLANNING, COMBAT, ROULETTE
    gold: 10,
    hp: 100,
    username: '',
    timeLeft: 30,
    timerInterval: null,
    shop: [null, null, null, null, null],
    bench: Array.from({ length: 9 }, () => []), // 9 fixed slots, each empty or containing 1 unit
    board: Array.from({ length: 21 }, () => []), // 21 fixed slots (3x7 grid)
    boardEnemy: Array.from({ length: 21 }, () => []), // 21 slots
    inventory: [], // Items array
    isDraggingFuggler: false, // True while dragging a fuggler from board/bench
  }),
  getters: {
    activeBoardUnits: (state) => {
      let count = 0
      state.board.forEach(slot => { if (slot.length > 0) count++ })
      return count
    }
  },
  actions: {
    startNewRound() {
      this.round++
      this.phase = 'PLANNING'
      this.timeLeft = 30 // 30 seconds for planning
      // Ingreso pasivo
      this.gold += 5 // Base gold per round
      this.rollShop(true)
      this.startTimer()
    },
    
    startTimer() {
      this.clearTimer()
      this.timerInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--
        } else {
          this.clearTimer()
          if (this.phase === 'PLANNING') {
            this.startCombat()
          }
        }
      }, 1000)
    },

    clearTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
    },

    startCombat() {
      this.phase = 'COMBAT'
      // TODO: Logic to spawn enemies and resolve combat automatically
    },
    
    rollShop(isFree = false) {
      if (!isFree && this.gold < 2) return // Reroll cost = 2
      if (!isFree) this.gold -= 2

      const probs = getShopProbabilities(this.round)
      const newShop = []

      for(let i=0; i<5; i++) {
        // Simple random roll based on probs
        const roll = Math.random() * 100
        let tierSelected = 1
        let cumulative = 0
        for(const [tier, p] of Object.entries(probs)) {
          cumulative += p
          if(roll <= cumulative) {
            tierSelected = parseInt(tier)
            break
          }
        }
        
        // Filter fugglers by tier
        const pool = FUGGLERS.filter(f => f.tier === tierSelected)
        if (pool.length > 0) {
          const randomUnit = pool[Math.floor(Math.random() * pool.length)]
          // We must clone the unit so each copy on board is unique!
          newShop.push({ ...randomUnit, instanceId: crypto.randomUUID(), stars: 1, items: [] })
        } else {
          newShop.push(null)
        }
      }
      this.shop = newShop
    },

    buyUnit(shopIndex) {
      if (this.phase !== 'PLANNING') return // Cannot buy during combat
      const unit = this.shop[shopIndex]
      if (!unit) return
      
      if (this.gold < unit.cost) return
      
      // Find empty bench slot
      const emptySlotIndex = this.bench.findIndex(slot => slot.length === 0)
      if (emptySlotIndex === -1) return // Bench full

      this.gold -= unit.cost
      // Remove positional ids from shop unit and grant a true instanceId
      this.bench[emptySlotIndex].push({...unit, instanceId: crypto.randomUUID()})
      this.shop[shopIndex] = null
      
      this.checkUpgrades()
    },

    sellUnit(location, index) {
      if (this.phase !== 'PLANNING') return
      let unit = null
      if (location === 'bench') {
        const slot = this.bench[index]
        if (slot.length > 0) unit = slot.pop()
      } else if (location === 'board') {
        const slot = this.board[index]
        if (slot.length > 0) unit = slot.pop()
      }

      if (unit) {
        // Devolver el coste completo del fuggler al vender
        this.gold += unit.cost
        // TODO: Handle Pelusa de Ombligo logic here if unit had items
      }
      this.checkUpgrades()
    },

    sellUnitByInstance(instanceId) {
      if (this.phase !== 'PLANNING') return
      // Search in bench
      for (let i = 0; i < this.bench.length; i++) {
        const slot = this.bench[i]
        if (slot.length > 0 && slot[0].instanceId === instanceId) {
          const unit = slot.pop()
          this.gold += unit.cost
          this.checkUpgrades()
          return
        }
      }
      // Search in board
      for (let i = 0; i < this.board.length; i++) {
        const slot = this.board[i]
        if (slot.length > 0 && slot[0].instanceId === instanceId) {
          const unit = slot.pop()
          this.gold += unit.cost
          this.checkUpgrades()
          return
        }
      }
    },

    setDraggingFuggler(value) {
      this.isDraggingFuggler = value
    },

    moveUnit(fromZone, toZone, fromIndex, toIndex) {
      // Zone can be 'bench' or 'board'
      const fromArray = fromZone === 'bench' ? this.bench : this.board
      const toArray = toZone === 'bench' ? this.bench : this.board

      const sourceUnit = fromArray[fromIndex]
      const targetUnit = toArray[toIndex]

      fromArray[fromIndex] = targetUnit
      toArray[toIndex] = sourceUnit
      
      this.checkUpgrades()
    },

    checkUpgrades() {
      // Check for 3 units of same id and same stars
      // They can be on the board or bench.
      const allUnits = []
      this.bench.forEach((slot, i) => { if (slot.length > 0) allUnits.push({ ...slot[0], loc: 'bench', idx: i }) })
      this.board.forEach((slot, i) => { if (slot.length > 0) allUnits.push({ ...slot[0], loc: 'board', idx: i }) })

      // Only stars 1 and 2 can upgrade
      for (let starLevel = 1; starLevel <= 2; starLevel++) {
        const groups = {}
        for (const unit of allUnits) {
          if (unit.stars === starLevel) {
            if (!groups[unit.id]) groups[unit.id] = []
            groups[unit.id].push(unit)
          }
        }
        for (const unitId in groups) {
          if (groups[unitId].length >= 3) {
            this.combineUnits(groups[unitId].slice(0, 3))
            setTimeout(() => this.checkUpgrades(), 100)
            return 
          }
        }
      }
    },

    combineUnits(threeUnits) {
      threeUnits.sort((a,b) => (a.loc === 'board' ? -1 : 1))
      const targetUnit = threeUnits[0]
      const otherUnits = [threeUnits[1], threeUnits[2]]

      // Remove others using their specific loc and idx
      otherUnits.forEach(u => {
        if (u.loc === 'board') this.board[u.idx] = []
        if (u.loc === 'bench') this.bench[u.idx] = []
      })

      // Upgrade target
      const targetSlot = targetUnit.loc === 'board' ? this.board[targetUnit.idx] : this.bench[targetUnit.idx]
      if (targetSlot.length > 0) {
        targetSlot[0].stars += 1
        targetSlot[0].stats.hp *= 1.8
        targetSlot[0].stats.damage *= 1.8
      }
    }

  }
})
