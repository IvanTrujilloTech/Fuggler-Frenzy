<script setup>
import { computed, ref } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { FUGGLER_TYPES } from '../data/fugglerPedia'

const store = useGameStore()

const activeSynergies = computed(() => {
  const counts = store.activeSynergies // e.g. { D: 2, B: 1 }
  const result = []
  
  for (const [id, count] of Object.entries(counts)) {
    const typeDef = FUGGLER_TYPES[id]
    if (!typeDef) continue
    
    let activeTier = 0
    let nextTier = typeDef.breakpoints[0]
    
    for (let i = 0; i < typeDef.breakpoints.length; i++) {
        if (count >= typeDef.breakpoints[i]) {
            activeTier = typeDef.breakpoints[i]
            nextTier = typeDef.breakpoints[i+1] || typeDef.breakpoints[i]
        } else {
            if (activeTier === 0 && i === 0) {
               nextTier = typeDef.breakpoints[0]
            }
            break
        }
    }
    
    result.push({
      ...typeDef,
      count,
      activeTier,
      nextTier,
      isActive: activeTier > 0
    })
  }
  
  // Sort: active first, then by count descending
  return result.sort((a, b) => {
    if (a.isActive && !b.isActive) return -1
    if (!a.isActive && b.isActive) return 1
    return b.count - a.count
  })
})

const hoveredSynergy = ref(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

const showTooltip = (syn, event) => {
  hoveredSynergy.value = syn
  const rect = event.currentTarget.getBoundingClientRect()
  // Situate the tooltip strictly to the right of the entire container.
  // The synergy-tracker container could be up to rect.right+some padding.
  // Since it's a fixed list, rect.right + 25 usually clears the scrollbar.
  tooltipX.value = rect.right + 30
  tooltipY.value = rect.top + (rect.height / 2)
}

const hideTooltip = () => {
  hoveredSynergy.value = null
}
</script>

<template>
  <div class="synergy-tracker">
    <h3 class="tracker-title">Sinergias</h3>
    <div class="synergy-list">
      <div 
        v-for="syn in activeSynergies" 
        :key="syn.id" 
        class="synergy-item"
        :class="{ 'is-active': syn.isActive }"
        :style="{ '--syn-color': syn.color }"
        @mouseenter="showTooltip(syn, $event)"
        @mouseleave="hideTooltip"
      >
        <div class="syn-icon" :style="{ borderColor: syn.isActive ? syn.color : '#000', backgroundColor: syn.isActive ? '#222' : '#111' }">
          <img v-if="syn.icon" :src="syn.icon" :alt="syn.name" class="syn-svg" />
          <span v-else>{{ syn.id }}</span>
        </div>
        <div class="syn-info">
          <div class="syn-name">{{ syn.name }}</div>
          <div class="syn-count">
            <span class="current-count" :class="{'highlight': syn.isActive}">{{ syn.count }}</span>
            <span class="separator">/</span>
            <span class="next-tier">{{ syn.nextTier }}</span>
          </div>
        </div>
        <div class="syn-breakpoints">
          <div 
            v-for="bp in syn.breakpoints" 
            :key="bp" 
            class="bp-dot"
            :class="{ 'bp-active': syn.count >= bp }"
          ></div>
        </div>
      </div>

      <div v-if="activeSynergies.length === 0" class="empty-state">
        Mueve unidades al tablero para activar sinergias
      </div>
    </div>
  </div>

  <Teleport to="body">
    <!-- Hover Tooltip Global -->
    <div 
      v-if="hoveredSynergy" 
      class="syn-global-tooltip"
      :style="{ 
        top: tooltipY + 'px', 
        left: tooltipX + 'px',
        '--syn-color': hoveredSynergy.color
      }"
    >
      <div class="tooltip-header" :style="{ color: hoveredSynergy.color }">{{ hoveredSynergy.name }}</div>
      <ul class="bonus-list">
        <li 
          v-for="bp in hoveredSynergy.breakpoints" 
          :key="'gblist-'+bp"
          class="bonus-list-item"
          :class="{ 'bonus-active': hoveredSynergy.activeTier >= bp }"
        >
          <span class="bonus-bp">({{ bp }})</span> {{ hoveredSynergy.bonuses && hoveredSynergy.bonuses[bp] ? hoveredSynergy.bonuses[bp] : 'Bono' }}
        </li>
      </ul>
    </div>
  </Teleport>
</template>

<style scoped>
.synergy-tracker {
  background: var(--color-felt);
  border: 4px dashed var(--color-stitch);
  border-radius: 4px 15px 4px 15px;
  padding: 10px;
  width: 220px;
  min-width: 220px;
  box-shadow: 5px 5px 0 rgba(0,0,0,0.8);
  transform: rotate(-1deg);
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto;
}

.tracker-title {
  color: var(--color-toxic);
  font-family: var(--title-font);
  font-size: 1.5rem;
  margin-bottom: 15px;
  text-align: center;
  text-shadow: 2px 2px 0 #000;
}

.synergy-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty-state {
  text-align: center;
  color: #888;
  font-style: italic;
  font-size: 0.9rem;
  padding: 10px 0;
}

.synergy-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #222;
  padding: 6px;
  border-radius: 8px;
  border: 2px solid #111;
  opacity: 0.7;
  transition: all 0.3s;
  cursor: help;
}

.synergy-item.is-active {
  opacity: 1;
  border-color: var(--syn-color);
  box-shadow: 0 0 8px var(--syn-color);
  transform: scale(1.02);
}

.syn-icon {
  width: 55px;
  height: 55px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #fff;
  border: 2px solid #000;
  overflow: hidden;
  padding: 4px;
}

.syn-svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.8));
}

.syn-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.syn-name {
  font-size: 1rem;
  font-weight: bold;
  color: #ddd;
}

.synergy-item.is-active .syn-name {
  color: var(--syn-color);
  text-shadow: 1px 1px 0 #000;
}

.syn-count {
  font-family: var(--number-font);
  font-size: 1.5rem;
  color: #888;
}

.current-count.highlight {
  color: #fff;
  font-weight: bold;
}

.syn-breakpoints {
  display: flex;
  gap: 3px;
}

.bp-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #333;
  border: 1px solid #111;
}

.bp-dot.bp-active {
  background: var(--syn-color);
  box-shadow: 0 0 4px var(--syn-color);
}

.syn-global-tooltip {
  position: absolute;
  transform: translateY(-50%); /* Center vertically relative to hovered item */
  background: #111;
  border: 3px solid var(--syn-color);
  padding: 12px;
  border-radius: 8px;
  width: 220px;
  z-index: 9999;
  box-shadow: 6px 6px 0 rgba(0,0,0,0.9);
  pointer-events: none; /* Let mouse pass through */
}

/* Arrow for tooltip */
.syn-global-tooltip::before {
  content: '';
  position: absolute;
  top: 50%;
  right: 100%;
  transform: translateY(-50%);
  border-width: 10px;
  border-style: solid;
  border-color: transparent var(--syn-color) transparent transparent;
}

.tooltip-header {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 8px;
  text-shadow: 2px 2px 0 #000;
  text-align: center;
  border-bottom: 2px dashed #333;
  padding-bottom: 6px;
}

.bonus-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.bonus-list-item {
  font-size: 0.8rem;
  color: #555;
  margin-bottom: 3px;
  display: flex;
  gap: 6px;
}

.bonus-list-item.bonus-active {
  color: #fff;
  font-weight: bold;
}

.bonus-bp {
  color: #777;
  font-family: var(--number-font);
}
.bonus-list-item.bonus-active .bonus-bp {
  color: inherit;
}

/* Custom scrollbar for tracker */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #111; 
  border-radius: 3px;
}
::-webkit-scrollbar-thumb {
  background: var(--color-stitch); 
  border-radius: 3px;
}
</style>
