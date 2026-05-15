<script setup>
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "../stores/gameStore";
import { useAudioStore } from '../stores/audioStore'
import ShopArea from "../components/ShopArea.vue";
import BoardArea from "../components/BoardArea.vue";
import SellPanel from "../components/SellPanel.vue";
import SynergyTracker from "../components/SynergyTracker.vue";
import Ranking from "../components/Ranking.vue";
import AudioSettings from '../components/AudioSettings.vue'
import iconCoin from "../assets/HUD/OBJECTS/COIN.svg";
import ObjectArea from "../components/ObjectArea.vue";
import PlanningEvent from "../components/PlanningEvent.vue";
import GameOver from "../components/GameOver.vue";
import { ARTIFACT_RECIPES, ITEM_COMPONENTS } from "../data/items";
import { ref, computed } from "vue";
import { useMultiplayerStore } from "../stores/multiplayerStore";

const store = useGameStore();
const multiStore = useMultiplayerStore();
const audioStore = useAudioStore()
const router = useRouter();
const showRecipes = ref(false);

const filteredRecipes = computed(() => {
  const recipes = {};
  for (const [key, rec] of Object.entries(ARTIFACT_RECIPES)) {
    // Skip if it's the costScale property or ombligo
    if (rec.recipe && ITEM_COMPONENTS[rec.recipe[0]] && ITEM_COMPONENTS[rec.recipe[1]]) {
      recipes[key] = rec;
    }
  }
  return recipes;
});

onMounted(() => {
  audioStore.playCombatMusic()
  if (!store.username) {
    router.push("/");
  }
});

onUnmounted(() => {
  store.clearTimer();
});
</script>

<template>
  <main class="game-container">
    <div class="scale-wrapper">
      <Ranking />
      <header class="game-header">
        <div class="hud">
          <div class="hud-item player-info">
            {{ store.username }} | HP:
            <span class="hp-text">{{ store.hp }}</span>
          </div>
          <div class="hud-item timer-info" :class="{
            warning: store.timeLeft <= 5 && store.phase === 'PLANNING',
          }">
            <span class="phase">{{
              store.phase === "PLANNING" && store.timeLeft === 0
                ? "LISTO"
                : store.phase
            }}</span>
            <span class="timer" v-if="store.phase === 'COMBAT'">PELEANDO...</span>
            <span class="timer" v-else-if="store.phase !== 'PLANNING' || store.timeLeft > 0">{{ store.timeLeft
              }}s</span>
            <span class="waiting" v-else>Esperando oponente...</span>
          </div>
          <div class="hud-item round-info">Ronda: {{ store.round }}</div>
          <div class="hud-item gold-info">
            <img :src="iconCoin" class="coin-icon" alt="Oro" />
            {{ store.gold }}

          </div>
          <button class="btn-recipes-main" @click="showRecipes = !showRecipes" title="Ver Recetas">
            <span class="plus-icon">+</span>
          </button>
        </div>

        <!-- Alerta de Error de Conexión -->
        <div v-if="multiStore.error" class="connection-error-banner">
          <span class="error-msg">⚠️ {{ multiStore.error }}</span>
          <button @click="multiStore.error = null" class="btn-dismiss">✕</button>
        </div>
      </header>

      <!-- Panel de Recetas de Artefactos -->
      <div v-if="showRecipes" class="recipes-modal" @click.self="showRecipes = false">
        <div class="recipes-modal-content">
          <div class="recipes-modal-header">
            <h4>Recetas de Artefactos</h4>
            <button class="btn-close-modal" @click="showRecipes = false">✕</button>
          </div>
          <div class="recipes-grid">
            <div v-for="(rec, key) in filteredRecipes" :key="key" class="recipe-card">
              <div class="recipe-formula">
                <img :src="ITEM_COMPONENTS[rec.recipe[0]]?.img" class="recipe-obj-img"
                  :title="ITEM_COMPONENTS[rec.recipe[0]]?.name" />
                <span class="formula-plus">+</span>
                <img :src="ITEM_COMPONENTS[rec.recipe[1]]?.img" class="recipe-obj-img"
                  :title="ITEM_COMPONENTS[rec.recipe[1]]?.name" />
                <span class="formula-equals">=</span>
                <img :src="rec.img" class="recipe-result-img" :title="`${rec.name}\n${rec.description}`" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="game-content">
        <SynergyTracker />
        <ObjectArea v-if="!store.planningEventActive" />
        <PlanningEvent />
        <BoardArea />
        <SellPanel />
      </div>

      <ShopArea />
    </div>

    <GameOver v-if="store.gameResult" :result="store.gameResult" />

    <AudioSettings />
  </main>
</template>

<style scoped>
.game-container {
  height: 100vh;
  width: 100vw;
  background-color: transparent;
  color: #fff;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.scale-wrapper {
  transform: scale(0.8);
  transform-origin: top center;
  width: 125%;
  height: 125%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.game-header {
  padding: 1rem;
  background: var(--color-felt);
  border-bottom: 5px dashed var(--color-stitch);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.8);
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
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 1);
  transform: rotate(1deg);
}

.player-info {
  transform: rotate(-2deg);
}

.coin-icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
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

.btn-recipes-main {
  background: #22c55e;
  border: 2px solid #000;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 4px;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.8);
  transition: transform 0.1s;
}

.btn-recipes-main:hover {
  transform: scale(1.1);
  background: #16a34a;
}

.btn-recipes-main:active {
  transform: scale(0.95);
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.8);
}

.plus-icon {
  color: #000;
  font-weight: 900;
  font-size: 18px;
  line-height: 1;
}

.recipes-modal {
  position: absolute;
  top: 15%;
  right: 16%;
  z-index: 1000;
  animation: slide-down-recipe 0.3s ease-out forwards;
}

@keyframes slide-down-recipe {
  0% {
    opacity: 0;
    transform: translateY(-20px);
    transform: translateX(-100px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.recipes-modal-content {
  background: var(--color-felt);
  border: 4px dashed #000;
  border-radius: 12px;
  padding: 20px;
  width: 408px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.8);
}

@media (max-width: 1366px) {
  .recipes-modal-content {
    width: 350px;
    padding: 15px;
  }
}

@media (max-width: 900px) {
  .recipes-modal-content {
    width: 280px;
    padding: 10px;
  }
}

.recipes-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.2);
  padding-bottom: 10px;
}

.recipes-modal-header h4 {
  margin: 0;
  font-family: var(--title-font);
  font-size: 1.5rem;
  color: #ffd700;
  text-shadow: 2px 2px 0 #000;
}

.btn-close-modal {
  background: #ef4444;
  color: white;
  border: 2px solid #000;
  border-radius: 5px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 2px 2px 0 #000;
}

.btn-close-modal:hover {
  background: #dc2626;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.recipe-card {
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid #000;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.recipe-formula {
  display: flex;
  align-items: center;
  gap: 10px;
}

.recipe-obj-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  filter: drop-shadow(1px 2px 2px rgba(0, 0, 0, 0.8));
}

.recipe-result-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  filter: drop-shadow(2px 3px 3px rgba(0, 0, 0, 0.9));
  margin-left: 5px;
}

.formula-plus,
.formula-equals {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 1px 1px 0 #000;
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

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.game-content {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  padding: 1rem;
  gap: 1rem;
}

@media (max-width: 600px) {
  .hud {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    justify-items: center;
  }

  .hud-item {
    font-size: 0.7rem;
    padding: 0.3rem 0.5rem;
    margin: 0;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
    transform: none !important;
    /* Quitar rotaciones para ahorrar espacio */
  }

  .timer-info {
    justify-content: center;
    gap: 0.4rem;
  }
}

@media (max-width: 900px) {
  .hud {
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }

  .hud-item {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
  }
}

@media (max-width: 768px) {
  .game-content {
    flex-direction: column;
    overflow-y: auto;
  }

  .sell {
    position: absolute;
    width: 69%;
    /* height: 142px; */
    /* left: -21px; */
    order: 1;
    /* left: 0; */
    right: 0;
  }

  .synergy {
    order: 3;
  }

  .board {
    order: 2;
  }
}

@media (max-width: 600px) {
  .hud {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    justify-items: center;
  }

  .hud-item {
    font-size: 0.7rem;
    padding: 0.3rem 0.5rem;
    margin: 0;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
    transform: none !important;
    /* Quitar rotaciones para ahorrar espacio */
  }

  .timer-info {
    justify-content: center;
    gap: 0.4rem;
  }
}

@media (max-width: 900px) {
  .hud {
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }

  .hud-item {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
  }
}

@media (max-width: 768px) {
  .game-content {
    flex-direction: column;
    overflow-y: auto;
  }
}

/* Estilos de error de conexión */
.connection-error-banner {
  background: #ef4444;
  color: white;
  padding: 8px 16px;
  margin-top: 10px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--title-font);
  border: 2px solid #000;
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);
  animation: slide-down 0.3s ease-out;
}

@keyframes slide-down {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.error-msg {
  font-size: 0.9rem;
  font-weight: bold;
}

.btn-dismiss {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
