<script setup>
import FugglerTooltip from './FugglerTooltip.vue'

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
</script>

<template>
  <FugglerTooltip :fuggler="fuggler">
    <div class="fuggler-unit" :class="`tier-${fuggler.tier}`">
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
  transition: all 0.2s;
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
</style>
