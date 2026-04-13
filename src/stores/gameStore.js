import { defineStore } from 'pinia'
import { FUGGLERS, getShopProbabilities } from '../data/fugglerPedia'

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
    }
  },
  actions: {
    startNewRound() {
      this.round++
      this.phase = 'PLANNING'
      this.timeLeft = 30 // 30 segundos de fase de planificacion
      // ingreso pasivo de oro al inicio de ronda
      this.gold += 5 // oro base por ronda
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
      // todo: logica para spawnear enemigos y resolver el combate automaticamente
    },
    
    rollShop(isFree = false) {
      if (!isFree && this.gold < 2) return // coste de reroll = 2 de oro
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
        
        // filtra fugglers por tier
        const pool = FUGGLERS.filter(f => f.tier === tierSelected)
        if (pool.length > 0) {
          const randomUnit = pool[Math.floor(Math.random() * pool.length)]
          // hay que clonar la unidad para que cada copia en el tablero sea unica
          newShop.push({ ...randomUnit, instanceId: crypto.randomUUID(), stars: 1, items: [] })
        } else {
          newShop.push(null)
        }
      }
      this.shop = newShop
    },

    buyUnit(shopIndex) {
      if (this.phase !== 'PLANNING') return // no se puede comprar durante el combate
      const unit = this.shop[shopIndex]
      if (!unit) return
      
      if (this.gold < unit.cost) return
      
      // busca el primer slot vacio del banquillo
      const emptySlotIndex = this.bench.findIndex(slot => slot.length === 0)
      if (emptySlotIndex === -1) return // banquillo lleno

      this.gold -= unit.cost
      // asigna un instanceId unico a la unidad comprada
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
        // devuelve el coste completo del fuggler al venderlo
        this.gold += unit.cost
        // todo: gestionar la logica de pelusa de ombligo si la unidad tenia objetos
      }
      this.checkUpgrades()
    },

    sellUnitByInstance(instanceId) {
      if (this.phase !== 'PLANNING') return
      // busca en el banquillo
      for (let i = 0; i < this.bench.length; i++) {
        const slot = this.bench[i]
        if (slot.length > 0 && slot[0].instanceId === instanceId) {
          const unit = slot.pop()
          this.gold += unit.cost
          this.checkUpgrades()
          return
        }
      }
      // busca en el tablero
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
      // la zona puede ser 'bench' o 'board'
      const fromArray = fromZone === 'bench' ? this.bench : this.board
      const toArray = toZone === 'bench' ? this.bench : this.board

      const sourceUnit = fromArray[fromIndex]
      const targetUnit = toArray[toIndex]

      fromArray[fromIndex] = targetUnit
      toArray[toIndex] = sourceUnit
      
      this.checkUpgrades()
    },

    checkUpgrades() {
      // comprueba si hay 3 unidades con el mismo id y las mismas estrellas
      // pueden estar en el tablero o en el banquillo
      const allUnits = []
      this.bench.forEach((slot, i) => { if (slot.length > 0) allUnits.push({ ...slot[0], loc: 'bench', idx: i }) })
      this.board.forEach((slot, i) => { if (slot.length > 0) allUnits.push({ ...slot[0], loc: 'board', idx: i }) })

      // solo las estrellas 1 y 2 pueden subir de nivel
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

      // elimina las otras dos unidades usando su loc e idx especificos
      otherUnits.forEach(u => {
        if (u.loc === 'board') this.board[u.idx] = []
        if (u.loc === 'bench') this.bench[u.idx] = []
      })

      // mejora la unidad objetivo
      const targetSlot = targetUnit.loc === 'board' ? this.board[targetUnit.idx] : this.bench[targetUnit.idx]
      if (targetSlot.length > 0) {
        targetSlot[0].stars += 1
        targetSlot[0].stats.hp *= 1.8
        targetSlot[0].stats.damage *= 1.8
      }
    }

  }
})
