<script setup>
import FugglerTooltip from './FugglerTooltip.vue'
import { useGameStore } from '../stores/gameStore'
import { computed } from 'vue'
import { FUGGLER_TYPES } from '../data/fugglerPedia'

const props = defineProps({
  fuggler: {
    type: Object,
    required: true
  },
  minimal: {
    type: Boolean,
    default: false
  }
})

const store = useGameStore()
const isFaded = computed(() => props.fuggler.side === 'enemy')
const isOnBoard = computed(() => store.board.some(slot => slot.some(u => u.instanceId === props.fuggler.instanceId)))

const activeSynergyColor = computed(() => {
  if (!isOnBoard.value) return null
  const activeSyns = store.activeSynergies || {}
  
  // Buscar el primer tipo que tenga sinergia activa. Si tiene varios, podrías mezclarlos o priorizar uno.
  for (const typeId of (props.fuggler.types || [])) {
    const count = activeSyns[typeId] || 0
    const typeDef = FUGGLER_TYPES[typeId]
    if (typeDef && count >= typeDef.breakpoints[0]) {
      return typeDef.color // Devolvemos el color de la sinergia activa
    }
  }
  return null
})
</script>

<template>
  <FugglerTooltip :fuggler="fuggler">
    <div 
      class="fuggler-unit" 
      :class="[`tier-${fuggler.tier}`, { 'has-synergy': activeSynergyColor }]"
      :style="activeSynergyColor ? { '--glow-color': activeSynergyColor, 'box-shadow': `0 0 15px ${activeSynergyColor}, 4px 4px 0 rgba(0,0,0,0.8)`, 'border-color': activeSynergyColor } : {}"
    >
      <img v-if="fuggler.image" :src="fuggler.image" :alt="fuggler.name" class="fuggler-image" />
    </div>
  </FugglerTooltip>
</template>

<style scoped>
.fuggler-unit {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 4px 12px 3px 8px; /* fallback si no es hexagono */
  background: var(--color-felt);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 4px 4px 0 rgba(0,0,0,0.8);
  border: 2px dashed #000;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.has-synergy {
  animation: pulse-border 2s infinite alternate;
}

@keyframes pulse-border {
  from { border-width: 2px; }
  to { border-width: 4px; filter: brightness(1.2); }
}

/* para encajar dentro del hexagono */
.is-hex .fuggler-unit {
  border-radius: 0;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  border: none;
  box-shadow: none;
}

/* texturas rayadas segun la rareza */
.tier-1 { background: repeating-linear-gradient(135deg, rgba(156,163,175,0.7), rgba(156,163,175,0.7) 4px, transparent 4px, transparent 8px), #374151; }
.tier-2 { background: repeating-linear-gradient(135deg, rgba(59,130,246,0.7), rgba(59,130,246,0.7) 4px, transparent 4px, transparent 8px), #1e3a8a; }
.tier-3 { background: repeating-linear-gradient(135deg, rgba(168,85,247,0.7), rgba(168,85,247,0.7) 4px, transparent 4px, transparent 8px), #581c87; }
.tier-4 { background: repeating-linear-gradient(135deg, rgba(245,158,11,0.7), rgba(245,158,11,0.7) 4px, transparent 4px, transparent 8px), #78350f; }

.fuggler-image {
  width: 65px;
  height: 65px;
  object-fit: contain;
  z-index: 1;
  filter: drop-shadow(2px 4px 6px black);
}
@media (max-width: 1366px) {
  .fuggler-image {
    width: 90%;
    height: 90%;
  }
}
</style>
