<script setup>
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()

function pick(option) {
  // solo en planning
  if (store.phase !== 'PLANNING') return

  store.pickPlanningOption(option);
}
</script>

<template>
  <Transition name="fade">
    <div v-if="store.planningEventActive" class="planning-event-overlay">
      <div class="planning-card">
        <h2 class="planning-title">EVENTO DE PLANIFICACIÓN</h2>
        <p class="planning-subtitle">¡Selecciona un contenedor para obtener un Fuggler y un objeto!</p>

        <div class="container-wrapper">
          <div v-for="(option, index) in store.planningOptions" :key="option.id" class="planning-container"
            :style="{ '--delay': index * 0.1 + 's' }" @click="pick(option)">
            <div class="inner-container">
              <div class="unit-preview">
                <img :src="option.fuggler.image" class="fuggler-img" />
                <span class="fuggler-name">{{ option.fuggler.name }}</span>
              </div>
              <div class="divider"></div>
              <div class="item-preview">
                <img :src="option.object.img" class="object-img" />
                <span class="object-name">{{ option.object.name || 'Objeto' }}</span>
              </div>
            </div>
            <div class="selection-hover"></div>
          </div>
        </div>

        <div class="timer-warning" v-if="store.timeLeft <= 5">
          Selección automática en {{ store.timeLeft }}s
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.planning-event-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.planning-card {
  background: linear-gradient(135deg, #1e1e2e 0%, #11111b 100%);
  border: 4px dashed #a855f7;
  border-radius: 20px;
  padding: 40px;
  max-width: 900px;
  width: 90%;
  text-align: center;
  box-shadow: 0 0 50px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.planning-title {
  font-family: 'Creepster', cursive;
  font-size: 3rem;
  color: #a855f7;
  margin-bottom: 5px;
  text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
  letter-spacing: 2px;
}

.planning-subtitle {
  color: #94a3b8;
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.container-wrapper {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.planning-container {
  flex: 1;
  min-width: 250px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(168, 85, 247, 0.2);
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  animation: slideUp 0.5s ease-out forwards;
  animation-delay: var(--delay);
  opacity: 0;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.planning-container:hover {
  transform: translateY(-10px) scale(1.02);
  background: rgba(168, 85, 247, 0.1);
  border-color: #a855f7;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.inner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.unit-preview,
.item-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.fuggler-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.object-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.fuggler-name {
  font-weight: bold;
  font-size: 1.1rem;
  color: #e2e8f0;
}

.divider {
  width: 80%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #a855f7, transparent);
  opacity: 0.5;
}

.object-name {
  font-size: 0.9rem;
  color: #94a3b8;
}

.selection-hover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(168, 85, 247, 0.4);
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  border-radius: 12px;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.planning-container:hover .selection-hover {
  opacity: 1;
}

.timer-warning {
  margin-top: 30px;
  color: #ef4444;
  font-weight: bold;
  font-family: monospace;
  font-size: 1.2rem;
  animation: blink 1s infinite;
}

@keyframes blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>