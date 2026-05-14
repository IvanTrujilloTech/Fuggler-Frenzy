<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { useMultiplayerStore } from '../stores/multiplayerStore'

const props = defineProps({
  result: {
    type: String, // 'WON' or 'LOST'
    required: true
  }
})

const store = useGameStore()
const multiStore = useMultiplayerStore()
const router = useRouter()

const isVictory = computed(() => props.result === 'WON')

const exitGame = async () => {
  await multiStore.leaveRoom()
  // Reset game store state partially if needed, but router push usually enough
  window.location.href = '/' // Hard reset to ensure all states are clean
}
</script>

<template>
  <div class="game-over-overlay" :class="{ 'is-victory': isVictory, 'is-defeat': !isVictory }">
    <div class="imagenesVictoria" v-if="isVictory">
      <img class="img-victoria1" src="../assets/HUD/FINAL_SCREEN/VICTORIA_FUGGLER_1.png">
      <img class="img-victoria2" src="../assets/HUD/FINAL_SCREEN/VICTORIA_FUGGLER_2.png">
    </div>
    <div class="imagenesDerrota" v-if="!isVictory">
      <img class="img-derrota1" src="../assets/HUD/FINAL_SCREEN/DERROTA_FUGGLER_1.png">
      <img class="img-derrota2" src="../assets/HUD/FINAL_SCREEN/DERROTA_FUGGLER_2.png">
    </div>
    <div class="result-card">
      <div class="card-inner">
        <div class="crown-icon" v-if="isVictory"><img class="imgvictoria"
            src="../assets/HUD/FINAL_SCREEN/VICTORIA_CORONA.png"></div>
        <!-- <img class="imgvictoria" src="../assets/HUD/Victoria.svg" v-if="isVictory"> -->
        <div class="skull-icon" v-else><img class="imgderrota" src="../assets/HUD/FINAL_SCREEN/DERROTA_CIRCULO.png">
        </div>
        <!-- <img class="imgderrota" src="../assets/HUD/Derrota.svg" v-else> -->

        <h1 class="result-title">{{ isVictory ? '¡VICTORIA!' : '¡ELIMINADO!' }}</h1>
        <p class="result-subtitle">
          {{ isVictory ? 'Has demostrado ser el Fuggler Maestro definitivo.' : 'Tus Fugglers han caído en combate...' }}
        </p>

        <div class="stats-summary">
          <div class="stat-item">
            <span class="label">Ronda Final</span>
            <span class="value">{{ store.round }}</span>
          </div>
          <div class="stat-item">
            <span class="label">Fugglers en Mesa</span>
            <span class="value">{{ store.activeBoardUnits }}</span>
          </div>
          <div class="stat-item">
            <span class="label">Oro Restante</span>
            <span class="value">{{ store.gold }}</span>
          </div>
        </div>

        <button class="exit-btn" @click="exitGame">
          Volver al Inicio
        </button>
      </div>
    </div>

    <div class="particles">
      <div v-for="n in 20" :key="n" class="particle"></div>
    </div>
  </div>
</template>

<style scoped>
.imagenesDerrota,
.imagenesVictoria {
  position: absolute;
  inset: 0;

  pointer-events: none;
}

.imagenesVictoria {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.img-victoria1,
.img-victoria2 {
  position: absolute;
  width: 350px;
  z-index: 1;
}

.img-victoria1 {
  top: 0;
  right: 0;
  width: 200px;
}

.img-victoria2 {
  bottom: 0;
  left: 0;
}

.img-derrota2,
.img-derrota1 {
  position: absolute;
  width: 300px;
}

.img-derrota2 {
  bottom: 0;
  right: -17%;
  z-index: 1;
}

.img-derrota1 {
  top: 2%;
  left: 13%;
  width: 250px;
  rotate: -30deg;

}

.imgvictoria,
.imgderrota {
  width: 100px;
  height: 100px;
}

@media (max-width: 1024px) and (min-width: 768px) {

  .imagenesDerrota,
  .imagenesVictoria {
    width: 80%;
    position: absolute;
    bottom: 0px;

    display: flex;
    gap: 30%;
    justify-content: space-between;
    align-items: flex-end;

  }
/* 
   .img-derrota2,
  .img-derrota1,
  .img-victoria2,
  .img-victoria1 {
    width: 300px;
    top: 0;
    right: 0;
    z-index: 1;
  }

  .img-derrota1 {
    width: 300px;
    bottom: 0;
    left: 0;
    z-index: 1;
  }  */
}

/* =========================
   LAPTOPS PEQUEÑOS (≤1366px)
   - Card un poco más pequeño
   - Imágenes más cercanas
========================= */
@media (max-width: 1366px) {

  .result-card {
    max-width: 430px; /* 500 → ~14% reduction */
    padding: 2.2rem 2rem;
    transform: rotate(-1deg); /* mantener ligero slant */
  }

  .result-title {
    font-size: 4rem;
  }

  .result-subtitle {
    font-size: 1.2rem;
    margin-bottom: 2.2rem;
  }

  .stats-summary {
    gap: 0.5rem;
    margin-bottom: 2.5rem;
  }

  .value {
    font-size: 1.6rem;
  }

  .exit-btn {
    font-size: 1.5rem;
    padding: 0.9rem 2.1rem;
  }

  /* =========================
     IMÁGENES PEGADAS AL CARD
  ========================= */

  .imagenesVictoria,
  .imagenesDerrota {
    inset: 0px;
  }

  .img-victoria1,
  .img-victoria2 {
    width: 200px;
  }

  .img-victoria1 {
    top: 5px;
    right: 5px;
  }

  .img-victoria2 {
    bottom: 5px;
    left: 5px;
  }

  .img-derrota1 {
    top: -31%;
        left: 23%;
        width: 220px;
        rotate: -30deg;
  }

  .img-derrota2 {
            bottom: 0px;
        right: 20%;
        width: 220px;
  }
}

/* =========================
   MONITORES GRANDES / 2K / 4K
========================= */
@media (min-width: 1920px) {

  .result-card {
    max-width: 650px;
    padding: 4rem;
    border-width: 5px;
  }

  .result-title {
    font-size: 5.5rem;
  }

  .result-subtitle {
    font-size: 1.7rem;
  }

  .stats-summary {
    gap: 1.5rem;
    margin-bottom: 3.5rem;
  }

  .stat-item {
    padding: 1.3rem;
  }

  .label {
    font-size: 1rem;
  }

  .value {
    font-size: 2.3rem;
  }

  .exit-btn {
    font-size: 2rem;
    padding: 1.2rem 3rem;
  }

  .imgvictoria,
  .imgderrota {
    width: 140px;
    height: 140px;
  }

  .img-victoria1,
  .img-victoria2,
  .img-derrota1,
  .img-derrota2 {
    width:350px;
  }

  .img-victoria1 {
    top: 10%;
    right: 30%;
  }

  .img-victoria2 {
    bottom: -20px;
    left: 30%;
  }

  .img-derrota1 {
    top: 10%;
    left: 30%;
    rotate: -45deg;
  }

  .img-derrota2 {
    bottom: 0px;
    right: 30%;
  }
}
/* =========================
   PORTÁTILES GRANDES / MONITORES MEDIOS
========================= */
@media (max-width: 1700px) and (min-width: 1200px) {

  .result-card {
    max-width: 520px;
    padding: 2.5rem;
  }

  .result-title {
    font-size: 4rem;
  }

  .result-subtitle {
    font-size: 1.2rem;
  }

  .stats-summary {
    gap: 0.8rem;
  }

  .stat-item {
    padding: 0.9rem;
  }

  .value {
    font-size: 1.6rem;
  }

  .exit-btn {
    font-size: 1.5rem;
    padding: 0.9rem 2rem;
  }



  .img-victoria1,
  .img-victoria2,
  .img-derrota1,
  .img-derrota2 {
    width: 300px;
  }

  .img-victoria1 {
    top: 2%;
    right: 25%;
  }

  .img-victoria2 {
    bottom: 0;
    left: 25%;
  }

  .img-derrota1 {
    top: 2%;
    rotate: -45deg;
    left: 25%;
  }

  .img-derrota2 {
    bottom: 0px;
    right: 35%;
  }
}
.game-over-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.5s ease-out;
}

.is-victory {
  background: radial-gradient(circle, rgba(203, 240, 102, 0.2) 0%, rgba(15, 15, 19, 0.95) 100%);
}

.is-defeat {
  background: radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, rgba(15, 15, 19, 0.95) 100%);
}

.result-card {
  position: relative;
  background: #1a1a20;
  border: 4px dashed var(--color-stitch);
  padding: 3rem;
  border-radius: 15px 40px 10px 50px;
  box-shadow: 15px 15px 0px rgba(0, 0, 0, 0.8);
  max-width: 500px;
  width: 90%;
  text-align: center;
  transform: rotate(-1deg);
  overflow: hidden;
}

.is-victory .result-card {
  border-color: var(--color-toxic);
  box-shadow: 15px 15px 0px var(--color-toxic);
}

.is-defeat .result-card {
  border-color: #ef4444;
  box-shadow: 15px 15px 0px #ef4444;
}

.card-inner {
  position: relative;
  z-index: 2;
}

.crown-icon,
.skull-icon {
  margin-bottom: 1rem;
  animation: float 3s infinite ease-in-out;
}

.result-title {
  font-family: var(--title-font);
  font-size: 4.5rem;
  margin: 0;
  letter-spacing: 4px;
  text-shadow: 4px 4px 0 #000;
}

.is-victory .result-title {
  color: var(--color-toxic);
}

.is-defeat .result-title {
  color: #ef4444;
}

.result-subtitle {
  font-family: 'Patrick Hand', cursive;
  font-size: 1.4rem;
  color: #ccc;
  margin-bottom: 2.5rem;
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;
}

.stat-item {
  background: rgba(0, 0, 0, 0.4);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.8rem;
  color: #888;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.value {
  font-family: var(--number-font);
  font-size: 1.8rem;
  color: #fff;
}

.exit-btn {
  background: #fff;
  color: #000;
  border: 3px solid #000;
  padding: 1rem 2.5rem;
  font-family: var(--title-font);
  font-size: 1.8rem;
  cursor: pointer;
  border-radius: 8px 20px 5px 15px;
  box-shadow: 5px 5px 0 #000;
  transition: all 0.2s;
}

.exit-btn:hover {
  transform: scale(1.1) rotate(2deg);
  background: var(--color-toxic);
}

.exit-btn:active {
  transform: scale(0.95);
  box-shadow: 2px 2px 0 #000;
}

/* Particles */
.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--color-toxic);
  opacity: 0.3;
  border-radius: 50%;
  animation: moveParticle 10s infinite linear;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0) rotate(0);
  }

  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes moveParticle {
  from {
    transform: translate(0, 0);
  }

  to {
    transform: translate(100vw, 100vh);
  }
}

/* Variedad de partículas */
.particle:nth-child(2n) {
  background: #a855f7;
  width: 6px;
  height: 6px;
}

.particle:nth-child(3n) {
  background: #ef4444;
  width: 8px;
  height: 8px;
}

.particle:nth-child(odd) {
  animation-duration: 15s;
}

.particle:nth-child(even) {
  animation-duration: 20s;
}
</style>
