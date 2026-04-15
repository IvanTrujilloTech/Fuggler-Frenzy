<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMultiplayerStore } from '../stores/multiplayerStore'
import { useGameStore } from '../stores/gameStore'

const router = useRouter()
const multiplayerStore = useMultiplayerStore()
const gameStore = useGameStore()

const username = ref(gameStore.username || '')
const pinInput = ref('')
const view = ref('init') // init, host, guest

const handleCreateRoom = async () => {
  if (!username.value.trim()) return
  gameStore.username = username.value
  await multiplayerStore.createRoom(username.value)
  view.value = 'host'
}

const handleJoinRoom = async () => {
  if (!username.value.trim() || !pinInput.value.trim()) return
  gameStore.username = username.value
  const success = await multiplayerStore.joinRoom(pinInput.value, username.value)
  if (success) {
    view.value = 'guest'
  }
}

const handleStartGame = async () => {
  await multiplayerStore.startGame()
}

// Watch for game start
multiplayerStore.$subscribe((mutation, state) => {
  if (state.gameState.status === 'PLANNING') {
    router.push('/game')
  }
})

onMounted(async () => {
  await multiplayerStore.initialize()
})
</script>

<template>
  <div class="lobby-container">
    <div class="glass-card">
      <h1 class="title">Sala de Espera</h1>
      
      <!-- Initial View: Choose Name and Action -->
      <div v-if="view === 'init'" class="setup-view">
        <div class="input-group">
          <label>Tu Nombre</label>
          <input v-model="username" placeholder="FugglerMaster" />
        </div>
        
        <div class="actions">
          <button class="primary-btn" @click="handleCreateRoom" :disabled="!username">
            Crear Sala
          </button>
          
          <div class="divider">Ó</div>
          
          <div class="input-group">
            <input v-model="pinInput" placeholder="Código PIN (6 dígitos)" maxlength="6" />
            <button class="secondary-btn" @click="handleJoinRoom" :disabled="!username || !pinInput">
              Unirse a Sala
            </button>
          </div>
        </div>
      </div>

      <!-- Host View: Waiting for Players -->
      <div v-if="view === 'host'" class="room-view">
        <div class="pin-display">
          <label>PIN de la Sala</label>
          <div class="pin-number">{{ multiplayerStore.roomId }}</div>
        </div>

        <div class="players-list">
          <h3>Jugadores ({{ Object.keys(multiplayerStore.players).length }}/2)</h3>
          <ul>
            <li v-for="player in multiplayerStore.players" :key="player.username">
              {{ player.username }} <span v-if="player.isHost">(Host)</span>
            </li>
          </ul>
        </div>

        <button 
          class="start-btn" 
          @click="handleStartGame" 
          :disabled="Object.keys(multiplayerStore.players).length < 2"
        >
          ¡EMPEZAR JUEGO!
        </button>
      </div>

      <!-- Guest View: Waiting for Host -->
      <div v-if="view === 'guest'" class="room-view">
        <div class="status-msg">
          <p>Conectado a la sala <strong>{{ multiplayerStore.roomId }}</strong></p>
          <p class="waiting-text">Esperando a que el Host empiece...</p>
        </div>

        <div class="players-list">
          <li v-for="player in multiplayerStore.players" :key="player.username">
            {{ player.username }} <span v-if="player.isHost">(Host)</span>
          </li>
        </div>
      </div>

      <p v-if="multiplayerStore.error" class="error-msg">{{ multiplayerStore.error }}</p>
      
      <button class="back-btn" @click="router.push('/')">Volver</button>
    </div>

    <div class="background-decorations">
      <div class="blob blob1"></div>
      <div class="blob blob2"></div>
    </div>
  </div>
</template>

<style scoped>
.lobby-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0f0f13;
  overflow: hidden;
  position: relative;
}

.glass-card {
  position: relative;
  z-index: 10;
  background: repeating-linear-gradient(45deg, #302b25, #302b25 10px, #2a251f 10px, #2a251f 20px);
  padding: 2.5rem;
  border-radius: 4px 18px 3px 20px;
  border: 4px dashed var(--color-stitch);
  box-shadow: 10px 10px 0px rgba(0,0,0,0.8);
  text-align: center;
  width: 90%;
  max-width: 500px;
}

.title {
  font-family: var(--title-font);
  font-size: 3rem;
  color: var(--color-toxic);
  margin-bottom: 2rem;
  text-shadow: 3px 3px 0px #000;
}

.input-group {
  text-align: left;
  margin-bottom: 1.5rem;
}

label {
  display: block;
  color: #fff;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 3px solid #000;
  background: #eee;
  font-family: 'Patrick Hand', cursive;
  font-size: 1.2rem;
}

.primary-btn, .secondary-btn, .start-btn {
  width: 100%;
  padding: 1rem;
  font-family: var(--title-font);
  font-size: 1.5rem;
  cursor: pointer;
  border: 3px solid #000;
  box-shadow: 4px 4px 0px #000;
  transition: transform 0.1s;
}

.primary-btn { background: var(--color-toxic); color: #000; }
.secondary-btn { background: #555; color: #fff; margin-top: 10px; }
.start-btn { background: var(--color-blood); color: #fff; margin-top: 2rem; font-size: 2rem; }

.divider {
  margin: 1.5rem 0;
  color: #888;
  font-weight: bold;
  position: relative;
}

.pin-display {
  background: #000;
  padding: 1rem;
  border: 2px dashed var(--color-toxic);
  margin-bottom: 2rem;
}

.pin-number {
  font-family: var(--number-font);
  font-size: 3.5rem;
  color: var(--color-toxic);
  letter-spacing: 5px;
}

.players-list {
  background: rgba(0,0,0,0.4);
  padding: 1rem;
  text-align: left;
  border: 1px solid #444;
}

.players-list h3 { color: #fff; margin-bottom: 10px; }
.players-list li { color: #ccc; list-style: none; padding: 5px 0; border-bottom: 1px solid #333; }

.waiting-text {
  color: var(--color-toxic);
  font-style: italic;
  margin-top: 10px;
  animation: pulse 1.5s infinite;
}

.error-msg { color: #ff4444; margin-top: 1rem; font-weight: bold; }

.back-btn {
  margin-top: 2rem;
  background: none;
  border: none;
  color: #888;
  text-decoration: underline;
  cursor: pointer;
}

@keyframes pulse {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}

.background-decorations {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
}
.blob {
  position: absolute;
  filter: blur(80px);
  opacity: 0.3;
  border-radius: 50%;
}
.blob1 { width: 400px; height: 400px; background: #a855f7; top: -100px; left: -100px; }
.blob2 { width: 300px; height: 500px; background: #3b82f6; bottom: -150px; right: -50px; }
</style>
