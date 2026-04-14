<script setup>
import { computed, ref } from 'vue'
import { useFloating, offset, flip, shift } from '@floating-ui/vue'
import { FUGGLER_TYPES } from '../data/fugglerPedia'
import { useGameStore } from '../stores/gameStore'
import iconDientudos from '../assets/HUD/SINERGYS/DIENTUDOS.svg'
import iconBotones from '../assets/HUD/SINERGYS/BOTONES.svg'
import iconRadioactivos from '../assets/HUD/SINERGYS/RADIOACTIVOS.svg'
import iconInadaptados from '../assets/HUD/SINERGYS/INADAPTADOS.svg'
import iconCazadores from '../assets/HUD/SINERGYS/CAZADORES.svg'

const SYNERGY_ICONS = {
  D: iconDientudos,
  B: iconBotones,
  R: iconRadioactivos,
  I: iconInadaptados,
  C: iconCazadores,
}

const props = defineProps({
  fuggler: {
    type: Object,
    required: true
  }
})

const reference = ref(null)
const floating = ref(null)
const isVisible = ref(false)

const gameStore = useGameStore()
const activeSynergies = computed(() => gameStore.activeSynergies)

const modifiedStats = computed(() => {
  if (!props.fuggler) return null
  const stats = { ...props.fuggler.stats }
  const synergies = activeSynergies.value
  
  // Apply Dientudos (D) - Damage
  const dCount = synergies.D || 0
  if (dCount >= 6) stats.damage *= 1.5
  else if (dCount >= 4) stats.damage *= 1.25
  else if (dCount >= 2) stats.damage *= 1.1

  // Apply Botones (B) - HP
  const bCount = synergies.B || 0
  if (bCount >= 6) stats.hp += 1000
  else if (bCount >= 5) stats.hp += 500
  else if (bCount >= 3) stats.hp += 200

  // Apply Inadaptados (I) - Armor
  const iCount = synergies.I || 0
  if (iCount >= 6) stats.armor += 100
  else if (iCount >= 5) stats.armor += 40
  else if (iCount >= 3) stats.armor += 15

  // Cazadores (C) - Crit
  const cCount = synergies.C || 0
  stats.crit = 0
  if (cCount >= 6) stats.crit = 80
  else if (cCount >= 4) stats.crit = 40
  else if (cCount >= 2) stats.crit = 15

  // Radioactivos (R) - Veneno
  const rCount = synergies.R || 0
  stats.veneno = 0
  if (rCount >= 6) stats.veneno = 70
  else if (rCount >= 4) stats.veneno = 30
  else if (rCount >= 2) stats.veneno = 10

  return stats
})

const isStatBoosted = (statName) => {
  if (!modifiedStats.value) return false
  const current = modifiedStats.value[statName]
  const base = props.fuggler.stats[statName] || 0
  return current > base
}

const { floatingStyles } = useFloating(reference, floating, {
  placement: 'top',
  strategy: 'fixed',
  middleware: [offset(10), flip(), shift({ padding: 10 })]
})

const show = () => isVisible.value = true
const hide = () => isVisible.value = false
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
        v-if="isVisible && fuggler" 
        ref="floating" 
        :style="[floatingStyles, { position: 'fixed' }]" 
        class="tooltip-content"
      >
        <div class="tt-header">
          <strong>{{ fuggler.name }}</strong>
          <span class="tt-tier">Tier {{ fuggler.tier }}</span>
        </div>
        <div class="tt-body">
          <div class="tt-types">
            <span
              v-for="typeKey in fuggler.types"
              :key="typeKey"
              class="tt-type-badge"
              :style="{ backgroundColor: FUGGLER_TYPES[typeKey].color, color: typeKey === 'R' ? '#000' : '#fff' }"
            >
              <img :src="SYNERGY_ICONS[typeKey]" class="type-icon" :alt="FUGGLER_TYPES[typeKey].name" />
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
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
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
  box-shadow: 0 10px 25px rgba(0,0,0,0.8);
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
  border: 1px solid rgba(0,0,0,0.4);
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}
.type-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
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
</style>
