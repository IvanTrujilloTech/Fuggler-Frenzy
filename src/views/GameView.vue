<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import ShopArea from '../components/ShopArea.vue'
import BoardArea from '../components/BoardArea.vue'
import SynergyTracker from '../components/SynergyTracker.vue'
import iconCoin from '../assets/HUD/OBJECTS/COIN.svg'

const store = useGameStore()
const router = useRouter()

onMounted(() => {
  if (!store.username) {
    router.push('/')
  }
})

onUnmounted(() => {
  store.clearTimer()
})
</script>

<template>
  <main class="game-container">
    <header class="game-header">
      <div class="hud">
        <div class="hud-item player-info">
          {{ store.username }} | HP: <span class="hp-text">{{ store.hp }}</span>
        </div>
        <div class="hud-item timer-info" :class="{ 'warning': store.timeLeft <= 5 }">
          <span class="phase">{{ store.phase }}</span>
          <span class="timer">{{ store.timeLeft }}s</span>
        </div>
        <div class="hud-item round-info">Ronda: {{ store.round }}</div>
        <div class="hud-item gold-info">
          <img :src="iconCoin" class="coin-icon" alt="Oro" />
          {{ store.gold }}
        </div>
      </div>
    </header>

    <div class="game-content">
      <SynergyTracker />
      <BoardArea />
    </div>

    <ShopArea />
  </main>
</template>

<style scoped>
.game-container {
  height: 100vh;
  background-color: transparent;
  color: #fff;
  display: flex;
  flex-direction: column;
}
.game-header {
  padding: 1rem;
  background: var(--color-felt);
  border-bottom: 5px dashed var(--color-stitch);
  box-shadow: 0 5px 15px rgba(0,0,0,0.8);
  z-index: 10;
}
.hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
  font-family: var(--number-font);
  font-size: 1rem;
}
.hud-item {
  padding: 0.5rem 1rem;
  background: #222;
  border: 3px solid #000;
  border-radius: 4px 10px 3px 8px;
  box-shadow: 4px 4px 0 rgba(0,0,0,1);
  transform: rotate(1deg);
}
.player-info {
  transform: rotate(-2deg);
}
.coin-icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
}
.gold-info {
  background: #d4af37;
  color: #000;
  transform: rotate(-1deg);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: bold;
}
.hp-text {
  color: var(--color-toxic);
}
.timer-info {
  display: flex;
  gap: 1rem;
  align-items: center;
  background: var(--color-blood);
  transform: scale(1.1) rotate(2deg);
  border-color: #000;
}
.phase {
  color: #8b5cf6;
  text-transform: uppercase;
}
.timer {
  font-family: monospace;
  font-size: 1.5rem;
}
.timer-info.warning .timer {
  color: #ef4444;
  animation: pulse 1s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}
.game-content {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  padding: 1rem;
  gap: 1rem;
}
</style>
