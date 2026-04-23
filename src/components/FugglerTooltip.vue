<script setup>
import { computed, ref, watch } from "vue";
import { useFloating, offset, flip, shift } from "@floating-ui/vue";
import { FUGGLER_TYPES } from "../data/fugglerPedia";
import { useGameStore } from "../stores/gameStore";
import iconDientudos from "../assets/HUD/SINERGYS/DIENTUDOS.svg";
import iconBotones from "../assets/HUD/SINERGYS/BOTONES.svg";
import iconRadioactivos from "../assets/HUD/SINERGYS/RADIOACTIVOS.svg";
import iconInadaptados from "../assets/HUD/SINERGYS/INADAPTADOS.svg";
import iconCazadores from "../assets/HUD/SINERGYS/CAZADORES.svg";
import coin from "../assets/HUD/OBJECTS/COIN.svg";
const SYNERGY_ICONS = {
  D: iconDientudos,
  B: iconBotones,
  R: iconRadioactivos,
  I: iconInadaptados,
  C: iconCazadores,
};

const props = defineProps({
  fuggler: {
    type: Object,
    required: true,
  },
});
const animatingUpgrade = ref(false);
const prevStars = ref(props.fuggler?.stars ?? 1);
const reference = ref(null);
const floating = ref(null);
const isVisible = ref(false);

const gameStore = useGameStore();
const activeSynergies = computed(() => gameStore.activeSynergies);
const isOnBoard = computed(() => {
  return gameStore.board.some(
    (slot) => slot.length > 0 && slot[0].instanceId === props.fuggler.instanceId
  );
});
const modifiedStats = computed(() => {
  if (!props.fuggler || !props.fuggler.stats) return null;

const stats = { ...props.fuggler.stats };
  const types = props.fuggler.types || [];
  if (!isOnBoard.value) return stats;
  const synergies = activeSynergies.value;

  if (types.includes("D")) {
    const dCount = synergies.D || 0;
    if (dCount >= 6) stats.damage *= 1.5;
    else if (dCount >= 4) stats.damage *= 1.25;
    else if (dCount >= 2) stats.damage *= 1.1;
  }
  if (types.includes("B")) {
    const bCount = synergies.B || 0;
    if (bCount >= 6) stats.hp += 1000;
    else if (bCount >= 5) stats.hp += 500;
    else if (bCount >= 3) stats.hp += 200;
  }
  if (types.includes("I")) {
    const iCount = synergies.I || 0;
    if (iCount >= 6) stats.armor += 100;
    else if (iCount >= 5) stats.armor += 40;
    else if (iCount >= 3) stats.armor += 15;
  }
  if (types.includes("C")) {
    const cCount = synergies.C || 0;
    stats.crit = 0;
    if (cCount >= 6) stats.crit = 80;
    else if (cCount >= 4) stats.crit = 40;
    else if (cCount >= 2) stats.crit = 15;
  }

  if (types.includes("R")) {
    const rCount = synergies.R || 0;
    stats.veneno = 0;
    if (rCount >= 6) stats.veneno = 70;
    else if (rCount >= 4) stats.veneno = 30;
    else if (rCount >= 2) stats.veneno = 10;
  }
  return stats;
});

const isStatBoosted = (statName) => {
  if (!modifiedStats.value) return false;
  if (!props.fuggler || !props.fuggler.stats) return false;

  const current = modifiedStats.value[statName] || 0;
  const base = props.fuggler.stats?.[statName] || 0;

  return current > base;
};

const upgradeLabel = computed(() => {
  const s = props.fuggler.stars ?? 1;

  if (s <= 1) return " (A)";
  if (s === 2) return "  (A+)";
  if (s === 3) return " (A++)";
});

const modifiedCost = computed(() => {
  const base = props.fuggler.cost ?? 0;
  const stars = props.fuggler.stars ?? 1;

  const scale = props.fuggler.costScale ?? {  
    1: 1,
  2: 3,
  3: 6,
  4: 9 };
  return base * (scale[stars] ?? stars);
});

watch(
  () => props.fuggler?.stars,
  (newVal, oldVal) => {
    if (!newVal) return;

    if (newVal > oldVal) {
      animatingUpgrade.value = true;

      setTimeout(() => {
        animatingUpgrade.value = false;
      }, 800); // duración animación
    }

    prevStars.value = newVal;
  }
);

const { floatingStyles } = useFloating(reference, floating, {
  placement: "top",
  strategy: "fixed",
  middleware: [offset(10), flip(), shift({ padding: 10 })],
});

const show = () => (isVisible.value = true);
const hide = () => (isVisible.value = false);
</script>

<template>
  <div
    class="tooltip-wrapper"
    ref="reference"
    @mouseenter="show"
    @mouseleave="hide"
  >
    <slot></slot>

    <Teleport to="body">
      <div
        v-if="isVisible && fuggler && fuggler.stats"
        ref="floating"
        :style="[floatingStyles, { position: 'fixed' }]"
        class="tooltip-content"
      >
       
        <div class="tt-header">
          <strong :class="{ 'upgrade-anim': animatingUpgrade }">
            {{ fuggler.name }}{{ upgradeLabel }}
          </strong>
          <span class="tt-tier">Tier {{ fuggler.tier }}</span>
        </div>
        <div class="tt-body">
          <div class="tt-types">
            <span
              v-for="typeKey in fuggler.types"
              :key="typeKey"
              class="tt-type-badge"
              :style="{
                backgroundColor: FUGGLER_TYPES[typeKey].color,
                color: typeKey === 'R' ? '#000' : '#fff',
              }"
            >
              <img
                :src="SYNERGY_ICONS[typeKey]"
                class="type-icon"
                :alt="FUGGLER_TYPES[typeKey].name"
              />
              {{ FUGGLER_TYPES[typeKey].name }}
            </span>
          </div>
           <div class="tt-stats" v-if="modifiedStats">
             <span :class="{ 'stat-boosted': isStatBoosted('hp') }">
               HP: {{ Math.floor(modifiedStats.hp) }}
             </span>
             <span :class="{ 'stat-boosted': isStatBoosted('damage') }">
               ATK: {{ Math.floor(modifiedStats.damage) }}
             </span>
             <span :class="{ 'stat-boosted': isStatBoosted('armor') }">
               DEF: {{ Math.floor(modifiedStats.armor) }}
             </span>
             <span>AS: {{ modifiedStats.attackSpeed }}</span>
             <span v-if="modifiedStats.crit > 0" class="stat-boosted">
               CRIT: {{ modifiedStats.crit }}%
             </span>
             <span v-if="modifiedStats.veneno > 0" class="stat-boosted">
               POISON: {{ modifiedStats.veneno }}%
             </span>
           </div>
           <div class="tt-items" v-if="fuggler.items && fuggler.items.length > 0">
             <div class="tt-items-label">Equipped Items:</div>
             <div class="tt-item-list">
               <span
                 v-for="item in fuggler.items"
                 :key="item.instanceId"
                 class="tt-item-badge"
               >
                 {{ item.name }}
               </span>
             </div>
           </div>
            <div class="tt-cost-big" :class="{ 'cost-pop': animatingUpgrade }">
           <img :src="coin" alt="Coin" class="coin-icon" />
           {{ modifiedCost }}
         </div>
         </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.tt-cost-big {
  font-size: 0.9em;
  display: flex;
  background: rgba(255, 215, 0, 0.1);
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  color: #fbbf24;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
  margin-top: 4px;
}
.tt-cost-big img{
  width: 24px;
  height: 24px;
}
.upgrade-anim {
  animation: upgradePop 0.8s ease-out;
  color: gold;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
}

@keyframes upgradePop {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }
  30% {
    transform: scale(1.25);
    filter: brightness(1.8);
  }
  60% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
}
.tooltip-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.tooltip-content {
  background: rgba(15, 15, 20, 0.95);
  border: 1px solid #a855f7;
  padding: 12px;
  border-radius: 8px;
  color: white;
  width: max-content;
  max-width: 250px;
  z-index: 1000;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.8);
  pointer-events: none;
  font-family: sans-serif;
  backdrop-filter: blur(5px);
}
.tt-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #444;
  padding-bottom: 5px;
  margin-bottom: 5px;
}
.tt-tier {
  font-size: 0.8em;
  color: gold;
}
.tt-types {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.tt-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8em;
  font-weight: bold;
  padding: 2px 8px 2px 4px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
.type-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}
.tt-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 15px;
  font-size: 0.9em;
  font-weight: bold;
}
.stat-boosted {
  color: #4ade80;
  text-shadow: 0 0 5px rgba(74, 222, 128, 0.3);
}
.tt-items {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #444;
}
.tt-items-label {
  font-size: 0.8em;
  color: #a855f7;
  margin-bottom: 4px;
  font-weight: bold;
}
.tt-item-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.tt-item-badge {
  font-size: 0.75em;
  padding: 2px 6px;
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid #a855f7;
  border-radius: 4px;
  color: #e9d5ff;
  text-align: left;
}
</style>
