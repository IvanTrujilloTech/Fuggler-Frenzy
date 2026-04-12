<script setup>
import { ref } from 'vue'
import { useFloating, offset, flip, shift } from '@floating-ui/vue'
import { FUGGLER_TYPES } from '../data/fugglerPedia'
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
          <div class="tt-stats">
            <span>HP: {{ Math.floor(fuggler.stats.hp) }}</span>
            <span>ATK: {{ Math.floor(fuggler.stats.damage) }}</span>
            <span>AS: {{ fuggler.stats.attackSpeed }}</span>
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
  display: flex;
  gap: 15px;
  font-size: 0.9em;
  font-weight: bold;
}
</style>
