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
    
    // Estado de combate
    combatUnits: [], // unidades activas en combate {instanceId, fuggler, side, pos: {q, r}, hp, maxHp, stats, target, lastAttack}
    combatInterval: null
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
        // Aseguramos que el tablero sea un array denso antes de subirlo (para evitar arrays dispersos en Firebase)
        const denseBoard = Array.from({ length: 21 }, (_, i) => this.board[i] || [])
        await multiStore.updatePlayerData({
          board: denseBoard,
          bench: this.bench,
          hp: this.hp,
          gold: this.gold,
          username: this.username
        })
      }
    },

    startNewRound() {
      const multiStore = useMultiplayerStore()
      // Sincronizar ronda desde la sala si es posible
      if (multiStore.gameState.round) {
        this.round = multiStore.gameState.round
      } else {
        this.round++
      }
      
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
          const multiStore = useMultiplayerStore()
          // En multijugador, el Host es el que dicta el cambio de fase oficial en Firebase
          if (multiStore.isHost && multiStore.gameState.status === 'PLANNING') {
            multiStore.updateRoomState({ status: 'COMBAT' })
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
      if (this.phase === 'COMBAT') return // evitar doble inicio
      this.phase = 'COMBAT'
      this.timeLeft = 0 // Sin tiempo límite para el combate
      this.initCombat()
      this.syncToFirebase()
      
      // Iniciamos el bucle de combate
      if (this.combatInterval) clearInterval(this.combatInterval)
      this.combatInterval = setInterval(() => {
        this.combatStep()
      }, 500) // Un paso cada 0.5 segundos 
    },

    initCombat() {
      const units = []
      const synergies = this.activeSynergies
      
      // Unidades del jugador (Slots 0-20 mapped to rows 3,4,5)
      this.board.forEach((slot, i) => {
        if (slot.length > 0) {
          const unit = slot[0]
          const row = 3 + Math.floor(i / 7)
          const col = i % 7
          units.push(this.prepareCombatUnit(unit, 'player', row, col, synergies))
        }
      })

      // Unidades enemigas (Slots 0-20 mapped to rows 0,1,2 - inverted)
      // Nota: El enemigo ve su tablero en rows 3,4,5. Nosotros lo vemos en 0,1,2.
      // Para oponente se asume la misma logica pero invertida.
      this.boardEnemy.forEach((slot, i) => {
        if (slot.length > 0) {
          const unit = slot[0]
          // Invertimos las filas del enemigo para que esten arriba (0,1,2)
          // Y las columnas tambien? Generalmente en autochess se refleja.
          const row = 2 - Math.floor(i / 7)
          const col = 6 - (i % 7)
          units.push(this.prepareCombatUnit(unit, 'enemy', row, col, {})) // Sinergias del enemigo vendran de su estado?
        }
      })

      this.combatUnits = units
    },

    prepareCombatUnit(unit, side, row, col, activeSynergies) {
      // Axial coordinates (even-row offset mapping)
      const r = row
      const q = col - Math.floor(row / 2)
      
      // Aplicar bonos de sinergia (simplificado para MVP)
      const stats = { ...unit.stats }
      if (activeSynergies['B']) { // Botones -> Vida
        const bonus = { 3: 200, 5: 500, 6: 1000 }[this.getBreakpoint('B', activeSynergies['B'])] || 0
        stats.hp += bonus
      }
      if (activeSynergies['D']) { // Dientudos -> Daño %
        const mult = { 2: 1.1, 4: 1.25, 6: 1.5 }[this.getBreakpoint('D', activeSynergies['D'])] || 1
        stats.damage *= mult
      }
      // ... otros bonos ...

      return {
        instanceId: unit.instanceId,
        id: unit.id,
        name: unit.name,
        side,
        pos: { q, r },
        hp: stats.hp,
        maxHp: stats.hp,
        stats,
        target: null,
        lastAttack: 0,
        isDead: false,
        image: unit.image
      }
    },

    getBreakpoint(typeId, count) {
      const type = FUGGLERS.flatMap(f => f.types).includes(typeId) ? { breakpoints: [2,4,6] } : { breakpoints: [3,5,6] } // Fallback
      // Usar constantes de fugglerPedia si es posible
      const breakpoints = [2, 3, 4, 5, 6] // Simplificado
      let activeBp = 0
      for (const bp of breakpoints) {
        if (count >= bp) activeBp = bp
      }
      return activeBp
    },

    combatStep() {
      if (this.phase !== 'COMBAT') {
        if (this.combatInterval) clearInterval(this.combatInterval)
        return
      }

      let playerAlive = false
      let enemyAlive = false

      this.combatUnits.forEach(unit => {
        if (unit.isDead) return
        if (unit.side === 'player') playerAlive = true
        else enemyAlive = true

        // 1. Buscar objetivo
        const enemies = this.combatUnits.filter(u => u.side !== unit.side && !u.isDead)
        if (enemies.length === 0) return

        let nearest = null
        let minDist = Infinity
        enemies.forEach(e => {
          const d = this.getHexDist(unit.pos, e.pos)
          if (d < minDist) {
            minDist = d
            nearest = e
          }
        })

        if (!nearest) return

        // 2. Accion: Atacar o Mover
        if (minDist <= 1) {
          // Atacar
          this.executeAttack(unit, nearest)
        } else {
          // Mover 1 paso hacia nearest
          this.moveTowards(unit, nearest.pos)
        }
      })

      // 3. Comprobar fin de combate
      if (!playerAlive || !enemyAlive) {
        this.endCombat(!enemyAlive ? 'player' : 'enemy')
      }
    },

    getHexDist(a, b) {
      return (Math.abs(a.q - b.q) + 
              Math.abs(a.q + a.r - b.q - b.r) + 
              Math.abs(a.r - b.r)) / 2
    },

    moveTowards(unit, targetPos) {
      const neighbors = this.getHexNeighbors(unit.pos)
      let bestMove = unit.pos
      let minDist = this.getHexDist(unit.pos, targetPos)

      neighbors.forEach(n => {
        // Verificar si la casilla está ocupada
        const occupied = this.combatUnits.some(u => !u.isDead && u.pos.q === n.q && u.pos.r === n.r)
        if (!occupied) {
          const d = this.getHexDist(n, targetPos)
          if (d < minDist) {
            minDist = d
            bestMove = n
          }
        }
      })

      unit.pos = bestMove
    },

    getHexNeighbors(pos) {
      const dirs = [
        {q: 1, r: 0}, {q: 1, r: -1}, {q: 0, r: -1},
        {q: -1, r: 0}, {q: -1, r: 1}, {q: 0, r: 1}
      ]
      return dirs.map(d => ({ q: pos.q + d.q, r: pos.r + d.r }))
        // Limitar al tablero 6x7
        .filter(n => {
          const row = n.r
          const col = n.q + Math.floor(n.r / 2)
          return row >= 0 && row < 6 && col >= 0 && col < 7
        })
    },

    executeAttack(unit, target) {
      const time = Date.now()
      if (time - unit.lastAttack < 1000 / unit.stats.attackSpeed) return

      unit.lastAttack = time
      // Daño mitigado por armadura (formula basica: dmg * (100 / (100 + armor)))
      const damage = unit.stats.damage * (100 / (100 + target.stats.armor))
      target.hp -= damage

      if (target.hp <= 0) {
        target.hp = 0
        target.isDead = true
      }
      
      // Activar flag para animacion en la UI si fuera necesario
      unit.isAttacking = true
      setTimeout(() => unit.isAttacking = false, 300)
    },

    endCombat(winner) {
      const multiStore = useMultiplayerStore()
      this.phase = 'IDLE' 
      if (winner === 'enemy') {
        this.hp -= 10 // Daño base por perder ronda (ajustar segun unidades vivas)
      }
      
      if (this.combatInterval) {
        clearInterval(this.combatInterval)
        this.combatInterval = null
      }

      // El host se encarga de transicionar la sala de nuevo a PLANNING en Firebase
      if (multiStore.isHost) {
        setTimeout(() => {
          multiStore.updateRoomState({ 
            status: 'PLANNING', 
            round: this.round + 1 
          })
        }, 5000) // 5 seg de pausa para ver resultados
      }
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
