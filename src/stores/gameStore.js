import { defineStore } from 'pinia'
import { FUGGLERS, getShopProbabilities } from '../data/fugglerPedia'
import { useMultiplayerStore } from './multiplayerStore'

export const useGameStore = defineStore('game', {
  state: () => ({
    round: 0,
    phase: 'IDLE', // fases posibles: IDLE, PLANNING, COMBAT, ROULETTE
    gold: 10,
    hp: 100,
    username: '',
    timeLeft: 30,
    timerInterval: null,
    shop: [null, null, null, null, null],
    bench: Array.from({ length: 9 }, () => []), // 9 slots fijos, cada uno vacio o con 1 unidad
    board: Array.from({ length: 21 }, () => []), // 21 slots fijos (cuadricula 3x7)
    boardEnemy: Array.from({ length: 21 }, () => []), // 21 slots del tablero enemigo
    inventory: [], // array de objetos del jugador
    isDraggingFuggler: false, // true mientras se arrastra un fuggler del tablero o banquillo
    draggingUnit: null, // unidad que se esta arrastrando desde el banquillo
  }),
  getters: {
    activeBoardUnits: (state) => {
      let count = 0
      state.board.forEach(slot => { if (slot.length > 0) count++ })
      return count
    },
    activeSynergies: (state) => {
      const uniqueUnits = new Set()
      const allUnitsLocs = [...state.board]
      const synergiesCount = {}
      
      allUnitsLocs.forEach(slot => {
        if (slot.length > 0) {
          const unit = slot[0]
          if (!uniqueUnits.has(unit.id)) {
            uniqueUnits.add(unit.id)
            if (unit.types) {
              unit.types.forEach(synergy => {
                synergiesCount[synergy] = (synergiesCount[synergy] || 0) + 1
              })
            }
          }
        }
      })
      
      return synergiesCount
    }
  },
  actions: {
    async syncToFirebase() {
      const multiStore = useMultiplayerStore()
      if (multiStore.roomId) {
        await multiStore.updatePlayerData({
          board: this.board,
          bench: this.bench,
          hp: this.hp,
          gold: this.gold,
          username: this.username
        })
      }
    },

    startNewRound() {
      this.round++
      this.phase = 'PLANNING'
      this.timeLeft = 30
      this.gold += 5 
      this.rollShop(true)
      this.startTimer()
      this.syncToFirebase()
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
      // La logica de combate se activará cuando ambos jugadores esten listos (sincronizado por Firebase)
      this.syncToFirebase()
    },
     
    rollShop(isFree = false) {
      if (!isFree && this.gold < 2) return 
      if (!isFree) this.gold -= 2

      const probs = getShopProbabilities(this.round)
      const newShop = []

      for(let i=0; i<5; i++) {
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
        
        const pool = FUGGLERS.filter(f => f.tier === tierSelected)
        if (pool.length > 0) {
          const randomUnit = pool[Math.floor(Math.random() * pool.length)]
          newShop.push({ ...randomUnit, instanceId: crypto.randomUUID(), stars: 1, items: [] })
        } else {
          newShop.push(null)
        }
      }
      this.shop = newShop
    },

    buyUnit(shopIndex) {
      if (this.phase !== 'PLANNING') return 
      const unit = this.shop[shopIndex]
      if (!unit) return
      
      if (this.gold < unit.cost) return
      
      const emptySlotIndex = this.bench.findIndex(slot => slot.length === 0)
      if (emptySlotIndex === -1) return 

      this.gold -= unit.cost
      this.bench[emptySlotIndex].push({...unit, instanceId: crypto.randomUUID()})
      this.shop[shopIndex] = null
      
      this.checkUpgrades()
      this.syncToFirebase()
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
        this.gold += unit.cost
      }
      this.checkUpgrades()
      this.syncToFirebase()
    },

    sellUnitByInstance(instanceId) {
      if (this.phase !== 'PLANNING') return
      for (let i = 0; i < this.bench.length; i++) {
        const slot = this.bench[i]
        if (slot.length > 0 && slot[0].instanceId === instanceId) {
          const unit = slot.pop()
          this.gold += unit.cost
          this.checkUpgrades()
          this.syncToFirebase()
          return
        }
      }
      for (let i = 0; i < this.board.length; i++) {
        const slot = this.board[i]
        if (slot.length > 0 && slot[0].instanceId === instanceId) {
          const unit = slot.pop()
          this.gold += unit.cost
          this.checkUpgrades()
          this.syncToFirebase()
          return
        }
      }
    },

    setDraggingFuggler(value) {
      this.isDraggingFuggler = value
    },

    moveUnit(fromZone, toZone, fromIndex, toIndex) {
      const fromArray = fromZone === 'bench' ? this.bench : this.board
      const toArray = toZone === 'bench' ? this.bench : this.board

      const sourceUnit = fromArray[fromIndex]
      const targetUnit = toArray[toIndex]

      fromArray[fromIndex] = targetUnit
      toArray[toIndex] = sourceUnit
      
      this.checkUpgrades()
      this.syncToFirebase()
    },

    checkUpgrades() {
      const allUnits = []
      this.bench.forEach((slot, i) => { if (slot.length > 0) allUnits.push({ ...slot[0], loc: 'bench', idx: i }) })
      this.board.forEach((slot, i) => { if (slot.length > 0) allUnits.push({ ...slot[0], loc: 'board', idx: i }) })

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

      otherUnits.forEach(u => {
        if (u.loc === 'board') this.board[u.idx] = []
        if (u.loc === 'bench') this.bench[u.idx] = []
      })

      const targetSlot = targetUnit.loc === 'board' ? this.board[targetUnit.idx] : this.bench[targetUnit.idx]
      if (targetSlot.length > 0) {
        targetSlot[0].stars += 1
        targetSlot[0].stats.hp *= 1.8
        targetSlot[0].stats.damage *= 1.8
      }
      this.syncToFirebase()
    }
  }
})

// === Líneas nuevas para la ruleta (comentadas) ===
// import { ITEM_COMPONENTS } from '../data/items'
//
// En state, añadir:
//   rouletteItems: Object.values(ITEM_COMPONENTS),
//   roulettePhase: false,
//   rouletteTimer: 10,
//   selectedRouletteItem: null,
//   rouletteInterval: null,
//
// Modificar startNewRound:
//   startNewRound() {
//     this.round++
//     if (this.round % 3 === 0) {
//       this.startRoulettePhase()
//     } else {
//       this.phase = 'PLANNING'
//       this.timeLeft = 30
//       this.gold += 5 
//       this.rollShop(true)
//       this.startTimer()
//     }
//     this.syncToFirebase()
//   },
//
// Modificar clearTimer:
//   clearTimer() {
//     if (this.timerInterval) {
//       clearInterval(this.timerInterval)
//       this.timerInterval = null
//     }
//     if (this.rouletteInterval) {
//       clearInterval(this.rouletteInterval)
//       this.rouletteInterval = null
//     }
//   },
//
// Agregar nuevas acciones:
//   startRoulettePhase() {
//     this.phase = 'ROULETTE'
//     this.roulettePhase = true
//     this.rouletteTimer = 10
//     this.selectedRouletteItem = null
//     this.rouletteInterval = setInterval(() => {
//       this.rouletteTimer--
//       if (this.rouletteTimer <= 0) {
//         this.endRoulettePhase()
//       }
//     }, 1000)
//     this.syncToFirebase()
//   },
// 
//   selectRouletteItem(item) {
//     if (!this.roulettePhase) return
//     this.selectedRouletteItem = item
//   },
// 
//   endRoulettePhase() {
//     this.roulettePhase = false
//     if (this.rouletteInterval) {
//       clearInterval(this.rouletteInterval)
//       this.rouletteInterval = null
//     }
//     if (this.selectedRouletteItem) {
//       this.inventory.push({ ...this.selectedRouletteItem })
//     }
//     this.selectedRouletteItem = null
//     this.phase = 'PLANNING'
//     this.timeLeft = 30
//     this.gold += 5
//     this.rollShop(true)
//     this.startTimer()
//     this.syncToFirebase()
//   }
