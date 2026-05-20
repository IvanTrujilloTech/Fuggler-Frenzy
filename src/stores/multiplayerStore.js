import { defineStore } from 'pinia'
import { db, auth } from '../firebase'
import { ref, set, get, onValue, push, update, onDisconnect, child, remove } from 'firebase/database'
import { signInAnonymously, setPersistence, browserSessionPersistence } from 'firebase/auth' //TODO: browserLocalPersistence  | Para que solo se pueda un personaje por dispositivo y para que se mantenga conectado aunque cierre la pestaña
import { useGameStore } from './gameStore'

export const useMultiplayerStore = defineStore('multiplayer', {
  state: () => ({
    roomId: null,
    playerKey: null,
    isHost: false,
    players: {},
    gameState: {
      status: 'WAITING',
      round: 0,
      phaseTimer: 30
    },
    error: null,
    loading: false
  }),

  actions: {
    async initialize() {
      try {
        // Establecer persistencia de sesión para permitir múltiples pestañas localmente
        await setPersistence(auth, browserSessionPersistence)
        const userCredential = await signInAnonymously(auth)
        this.playerKey = userCredential.user.uid
      } catch (e) {
        this.error = "Error al conectar con Firebase"
        console.error(e)
      }
    },

    async leaveRoom() {
      if (!this.roomId || !this.playerKey) return

      try {
        const playerRef = ref(db, `rooms/${this.roomId}/players/${this.playerKey}`)
        await remove(playerRef)

        // Verificamos si la sala se ha quedado vacía
        const roomPlayersRef = ref(db, `rooms/${this.roomId}/players`)
        const snapshot = await get(roomPlayersRef)
        
        if (!snapshot.exists() || Object.keys(snapshot.val()).length === 0) {
          const roomRef = ref(db, `rooms/${this.roomId}`)
          await remove(roomRef)
        }

        // Reset state local
        this.roomId = null
        this.isHost = false
        this.players = {}
        this.gameState = { status: 'WAITING', round: 0, phaseTimer: 30 }
      } catch (e) {
        console.error("Error al salir de la sala:", e)
      }
    },

    async createRoom(username) {
      if (this.roomId) await this.leaveRoom()
      if (!this.playerKey) await this.initialize()

      this.loading = true
      // Generate a 6-digit PIN
      const pin = Math.floor(100000 + Math.random() * 900000).toString()
      const roomRef = ref(db, `rooms/${pin}`)

      const newRoom = {
        settings: {
          maxPlayers: 8,
          createdAt: Date.now()
        },
        gameState: {
          status: 'WAITING',
          round: 0,
          phaseTimer: 30
        },
        players: {
          [this.playerKey]: {
            username,
            hp: 100,
            gold: 10,
            isHost: true,
            isReady: true, // El host siempre está listo
            board: Array.from({ length: 21 }, () => []),
            bench: Array.from({ length: 9 }, () => [])
          }
        }
      }

      await set(roomRef, newRoom)
      this.roomId = pin
      this.isHost = true
      this.loading = false

      this.listenToRoom(pin)
      this.handleDisconnect(pin)
    },

    async joinRoom(pin, username) {
      if (this.roomId) await this.leaveRoom()
      if (!this.playerKey) await this.initialize()

      this.loading = true
      const roomRef = ref(db, `rooms/${pin}`)
      const snapshot = await get(roomRef)

      if (!snapshot.exists()) {
        this.error = "La sala no existe"
        this.loading = false
        return false
      }

      const roomData = snapshot.val()
      const playerCount = Object.keys(roomData.players || {}).length

      if (playerCount >= roomData.settings.maxPlayers) {
        this.error = "La sala está llena"
        this.loading = false
        return false
      }

      const playerRef = ref(db, `rooms/${pin}/players/${this.playerKey}`)
      await set(playerRef, {
        username,
        hp: 100,
        gold: 10,
        isHost: false,
        isReady: false,
        board: Array.from({ length: 21 }, () => []),
        bench: Array.from({ length: 9 }, () => [])
      })

      this.roomId = pin
      this.isHost = false
      this.loading = false

      this.listenToRoom(pin)
      this.handleDisconnect(pin)
      return true
    },

    async toggleReady() {
      if (!this.roomId || !this.playerKey) return
      const currentPlayer = this.players[this.playerKey]
      if (!currentPlayer) return

      const readyRef = ref(db, `rooms/${this.roomId}/players/${this.playerKey}/isReady`)
      await set(readyRef, !currentPlayer.isReady)
    },

    listenToRoom(pin) {
      const roomRef = ref(db, `rooms/${pin}`)
      const gameStore = useGameStore()

      onValue(roomRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          this.players = data.players || {}
          this.gameState = data.gameState || {}

          // Encontrar al oponente segun los matchups de la ronda
          const matchups = this.gameState.matchups || {}
          const opponentId = matchups[this.playerKey]
          
          if (opponentId && this.players[opponentId]) {
            // Normalizar el tablero enemigo (asegurar 21 slots)
            const rawBoard = this.players[opponentId].board || []
            const normalizedBoard = Array.from({ length: 21 }, (_, i) => rawBoard[i] || [])
            gameStore.boardEnemy = normalizedBoard
          } else {
            gameStore.boardEnemy = Array.from({ length: 21 }, () => [])
          }

          // Sincronizar fase de juego (Round LifeCycle)
          if (this.gameState.status === 'PLANNING' && gameStore.phase !== 'PLANNING') {
            gameStore.startNewRound()
          }

          gameStore.checkVictory()
          
          if (this.gameState.status === 'COMBAT' && gameStore.phase !== 'COMBAT' && gameStore.phase !== 'COMBAT_FINISHED') {
            gameStore.startCombat()
          }
        } else {
          // Si el nodo de la sala desaparece, reseteamos localmente
          this.roomId = null
          this.isHost = false
          this.players = {}
        }
      }, (err) => {
        this.error = "Error de sincronización: " + err.message
        console.error("Firebase onValue Error:", err)
      })
    },

    handleDisconnect(pin) {
      // Usamos multifuncion para remover al jugador y, opcionalmente, borrar la sala si no queda nadie
      // En Firebase onDisconnect es limitado, solo borramos al jugador.
      // El borrado de sala vacía se gestiona mejor manualmente en el cliente al salir.
      const playerRef = ref(db, `rooms/${pin}/players/${this.playerKey}`)
      onDisconnect(playerRef).remove()
    },

    async updatePlayerData(data) {
      if (!this.roomId || !this.playerKey) return
      const playerRef = ref(db, `rooms/${this.roomId}/players/${this.playerKey}`)
      await update(playerRef, data)
    },

    async startGame() {
      if (!this.isHost || !this.roomId) return
      
      const playerCount = Object.keys(this.players).length
      if (![2, 4, 6, 8].includes(playerCount)) {
        this.error = "No se puede iniciar la partida. Solo se permiten salas con un número par de jugadores (2, 4, 6 u 8)."
        return
      }

      const stateRef = ref(db, `rooms/${this.roomId}/gameState`)
      await update(stateRef, { status: 'PLANNING', round: 1 })
    },

    async setReadyForCombat(ready = true) {
      if (!this.roomId || !this.playerKey) return
      await this.updatePlayerData({ isReadyForCombat: ready })
    },

    async updateRoomState(data) {
      if (!this.isHost || !this.roomId) return
      try {
        const stateRef = ref(db, `rooms/${this.roomId}/gameState`)
        await update(stateRef, data)
        this.error = null // Limpiar error si la actualización tiene éxito
      } catch (err) {
        this.error = "Error al actualizar estado: " + err.message
        console.error(err)
      }
    },

    async generateMatchups() {
      if (!this.isHost || !this.roomId) return
      
      const playersList = Object.keys(this.players)
      if (playersList.length < 2) return

      // Obtener historial de enfrentamientos
      const historyRef = ref(db, `rooms/${this.roomId}/matchupHistory`)
      const historySnap = await get(historyRef)
      const history = historySnap.exists() ? historySnap.val() : {}

      // Mezclar jugadores aleatoriamente
      const shuffled = [...playersList].sort(() => Math.random() - 0.5)
      const pairs = {}
      const used = new Set()

      for (let i = 0; i < shuffled.length; i++) {
        const p1 = shuffled[i]
        if (used.has(p1)) continue

        let bestOpponent = null
        let minEncounters = Infinity

        for (let j = i + 1; j < shuffled.length; j++) {
          const p2 = shuffled[j]
          if (used.has(p2)) continue

          const pairId = [p1, p2].sort().join('_')
          const encounters = history[pairId] || 0

          if (encounters < minEncounters) {
            minEncounters = encounters
            bestOpponent = p2
          }
        }

        if (bestOpponent) {
          pairs[p1] = bestOpponent
          pairs[bestOpponent] = p1
          used.add(p1)
          used.add(bestOpponent)

          // Actualizar historial
          const pairId = [p1, bestOpponent].sort().join('_')
          history[pairId] = (history[pairId] || 0) + 1
        }
      }

      // Si queda uno suelto (impar), se queda solo por ahora (o se le podria asignar un fantasma)
      // Actualizar en Firebase
      await update(ref(db, `rooms/${this.roomId}`), {
        matchupHistory: history,
        'gameState/matchups': pairs
      })
    }
  }
})
