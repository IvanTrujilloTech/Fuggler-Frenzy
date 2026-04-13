<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'

const router = useRouter()
const store = useGameStore()
const username = ref('')

const startGame = () => {
  if (username.value.trim() !== '') {
    store.username = username.value
    store.startNewRound()
    router.push('/game')
  }
}
</script>

<template>
  <div class="landing-container">
    <div class="glass-card">
      <h1 class="title">Fuggler Frenzy</h1>
      <p class="subtitle">Autochess Edition</p>
      
      <div class="input-group">
        <label for="username">Nombre de Jugador</label>
        <input 
          id="username" 
          v-model="username" 
          type="text" 
          placeholder="Ej: FugglerMaster67" 
          @keyup.enter="startGame"
        />
      </div>
      
      <button class="start-btn" @click="startGame" :disabled="!username.trim()">
        Entrar a la Arena
      </button>

      <button class="pedia-btn" @click="router.push('/pedia')">
        Ir a FugglerPedia
      </button>
    </div>
    
    <div class="background-decorations">
      <div class="blob blob1"></div>
      <div class="blob blob2"></div>
    </div>
  </div>
</template>

<style scoped>
.landing-container {
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
  padding: 3rem;
  border-radius: 4px 18px 3px 20px; /* corte irregular de esquinas */
  border: 4px dashed var(--color-stitch);
  box-shadow: 10px 10px 0px rgba(0,0,0,0.8);
  text-align: center;
  width: 400px;
  transform: rotate(-2deg);
}
.title {
  font-family: var(--title-font);
  font-size: 4rem;
  color: var(--color-toxic);
  margin-bottom: 0px;
  text-shadow: 4px 4px 0px #000;
  letter-spacing: 5px;
  transform: rotate(3deg);
}
.subtitle {
  font-family: var(--number-font);
  color: #fff;
  margin-bottom: 2rem;
  letter-spacing: 0px;
  font-size: 0.9rem;
  text-transform: uppercase;
  background: var(--color-blood);
  display: inline-block;
  padding: 5px 15px;
  transform: rotate(-1deg);
  box-shadow: 2px 2px 0 #000;
}
.input-group {
  text-align: left;
  margin-bottom: 2rem;
}
.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
}
input {
  width: 100%;
  padding: 1rem;
  border-radius: 0;
  border: 3px solid #000;
  background: #eee;
  color: #000;
  font-family: 'Patrick Hand', cursive;
  font-size: 1.5rem;
  box-shadow: inset 2px 2px 5px rgba(0,0,0,0.5);
}
input:focus {
  outline: none;
  background: #fff;
  border-color: var(--color-toxic);
}
.start-btn {
  width: 100%;
  padding: 1rem;
  margin-top: 10px;
  background: var(--color-toxic);
  color: #000;
  border: 3px solid #000;
  border-radius: 10px 2px 10px 3px;
  font-family: var(--title-font);
  font-size: 2rem;
  letter-spacing: 2px;
  cursor: pointer;
  transition: transform 0.1s;
  box-shadow: 4px 4px 0px #000;
}
.start-btn:not(:disabled):hover {
  transform: scale(1.05) rotate(2deg);
  background: #cbf066;
}
.start-btn:disabled {
  background: #555;
  color: #222;
  box-shadow: none;
  cursor: not-allowed;
}
.pedia-btn {
  width: 100%;
  padding: 0.8rem;
  margin-top: 15px;
  background: #111;
  color: #fff;
  border: 3px dashed var(--color-stitch);
  border-radius: 10px 2px 10px 3px;
  font-family: var(--title-font);
  font-size: 1.2rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: transform 0.1s;
  box-shadow: 4px 4px 0px #000;
}
.pedia-btn:hover {
  transform: scale(1.02) rotate(-1deg);
  background: #2a251f;
  color: var(--color-toxic);
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
.blob1 {
  width: 400px; height: 400px;
  background: #a855f7;
  top: -100px; left: -100px;
}
.blob2 {
  width: 300px; height: 500px;
  background: #3b82f6;
  bottom: -150px; right: -50px;
}
</style>
