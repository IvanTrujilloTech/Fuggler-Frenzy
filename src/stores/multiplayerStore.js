import { defineStore } from 'pinia'
import { db, auth } from '../firebase'
import { ref, set, get, onValue, push, update, onDisconnect, child } from 'firebase/database'
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

    async createRoom(username) {
      if (!this.playerKey) await this.initialize()

      this.loading = true
      // Generate a 6-digit PIN
      const pin = Math.floor(100000 + Math.random() * 900000).toString()
      const roomRef = ref(db, `rooms/${pin}`)

      const newRoom = {
        settings: {
          maxPlayers: 2,
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
            isReady: false,
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

    listenToRoom(pin) {
      const roomRef = ref(db, `rooms/${pin}`)
      const gameStore = useGameStore()

      onValue(roomRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          this.players = data.players || {}
          this.gameState = data.gameState || {}

          // Encontrar al oponente
          const opponentId = Object.keys(this.players).find(id => id !== this.playerKey)
          if (opponentId && this.players[opponentId]) {
            // Actualizar el tablero enemigo en el gameStore
            // Nota: El tablero enemigo debe verse invertido o tal cual, dependiendo de la logica de la UI
            gameStore.boardEnemy = this.players[opponentId].board || Array.from({ length: 21 }, () => [])
          }

          // Sincronizar fase de juego
          if (this.gameState.status === 'PLANNING' && gameStore.phase === 'IDLE') {
            gameStore.startNewRound()
          }
        }
      })
    },

    handleDisconnect(pin) {
      const playerRef = ref(db, `rooms/${pin}/players/${this.playerKey}`)
      onDisconnect(playerRef).remove()

      // If host leaves, maybe remove room or assign new host (complex)
      // For now, simple removal of player
    },

    async updatePlayerData(data) {
      if (!this.roomId || !this.playerKey) return
      const playerRef = ref(db, `rooms/${this.roomId}/players/${this.playerKey}`)
      await update(playerRef, data)
    },

    async startGame() {
      if (!this.isHost || !this.roomId) return
      const stateRef = ref(db, `rooms/${this.roomId}/gameState`)
      await update(stateRef, { status: 'PLANNING', round: 1 })
    }
  }
})
