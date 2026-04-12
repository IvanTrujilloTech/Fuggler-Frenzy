<script setup>
import { computed } from 'vue'
import FugglerTooltip from './FugglerTooltip.vue'

const props = defineProps({
  fuggler: {
    type: Object,
    required: true
  }
})

// Star symbol display
const starsDisplay = computed(() => {
  if (props.fuggler.stars === 1) return 'A'
  if (props.fuggler.stars === 2) return 'A+'
  if (props.fuggler.stars === 3) return 'A++'
  return 'A'
})
</script>

<template>
  <FugglerTooltip :fuggler="fuggler">
    <div class="fuggler-unit" :class="`tier-${fuggler.tier}`">
      <div class="stars">{{ starsDisplay }}</div>
      <div class="hp-bar">
        <div class="hp-fill" style="width: 100%"></div>
      </div>
      <img v-if="fuggler.image" :src="fuggler.image" :alt="fuggler.name" class="fuggler-image" />
    </div>
  </FugglerTooltip>
</template>

<style scoped>
.fuggler-unit {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 4px 12px 3px 8px; /* Fallback si no es hex */
  background: var(--color-felt);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 4px 4px 0 rgba(0,0,0,0.8);
  border: 2px dashed #000;
  color: white;
  transition: all 0.2s;
}

/* Para encajar en el hexágono */
.is-hex .fuggler-unit {
  border-radius: 0;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  border: none;
  box-shadow: none;
}

/* Texturas rayadas por rareza */
.tier-1 { background: repeating-linear-gradient(135deg, rgba(156,163,175,0.7), rgba(156,163,175,0.7) 4px, transparent 4px, transparent 8px), #374151; }
.tier-2 { background: repeating-linear-gradient(135deg, rgba(59,130,246,0.7), rgba(59,130,246,0.7) 4px, transparent 4px, transparent 8px), #1e3a8a; }
.tier-3 { background: repeating-linear-gradient(135deg, rgba(168,85,247,0.7), rgba(168,85,247,0.7) 4px, transparent 4px, transparent 8px), #581c87; }
.tier-4 { background: repeating-linear-gradient(135deg, rgba(245,158,11,0.7), rgba(245,158,11,0.7) 4px, transparent 4px, transparent 8px), #78350f; }

.stars {
  position: absolute;
  top: 15%;
  left: 15%;
  font-family: var(--title-font);
  color: gold;
  text-shadow: 2px 2px 0 #000;
  font-size: 1.2rem;
  transform: rotate(-10deg);
}
.hp-bar {
  position: absolute;
  top: 18%;
  right: 15%;
  width: 25px;
  height: 8px;
  background: #000;
  border-radius: 0;
  border: 1px solid #000;
  overflow: hidden;
  box-shadow: 2px 2px 0 var(--color-blood);
}
.hp-fill {
  background: var(--color-toxic);
  height: 100%;
}
.fuggler-image {
  width: 65px;
  height: 65px;
  object-fit: contain;
  z-index: 1;
  filter: drop-shadow(2px 4px 6px black);
}
</style>
