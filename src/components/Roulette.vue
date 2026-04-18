<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { ITEM_COMPONENTS } from '../data/items'

const store = useGameStore()

const isSpinning = ref(true)
const currentRotation = ref(0)
const selectedItemId = ref(null)
const lastAwardRound = ref(0)

// Get all object items as array
const objectItems = computed(() => {
  return Object.values(ITEM_COMPONENTS)
})

// Number of items to show on the roulette
const rouletteSize = computed(() => Math.min(objectItems.value.length, 8))

// Distribute items around the circle
const itemPositions = computed(() => {
  const positions = []
  const angleStep = (2 * Math.PI) / rouletteSize.value
  
  for (let i = 0; i < rouletteSize.value; i++) {
    const angle = i * angleStep - Math.PI / 2 // Start from top
    positions.push({
      item: objectItems.value[i],
      angle: angle,
      x: Math.cos(angle),
      y: Math.sin(angle)
    })
  }
  return positions
})

// Animation speed
const rotationSpeed = 0.005 // radians per frame

// Animation loop
let animationFrameId = null

const animate = () => {
  if (isSpinning.value) {
    currentRotation.value += rotationSpeed
    if (currentRotation.value > 2 * Math.PI) {
      currentRotation.value -= 2 * Math.PI
    }
  }
  animationFrameId = requestAnimationFrame(animate)
}

// Start animation
animate()

// Check every second if we need to stop for round-based award
let intervalId = null

const checkRoundAward = () => {
  const currentRound = store.round
  
  // Every 3 rounds (and not round 0), award an item
  if (currentRound > 0 && currentRound % 3 === 0 && currentRound !== lastAwardRound.value) {
    lastAwardRound.value = currentRound
    
    // Stop spinning briefly
    isSpinning.value = false
    
    // Determine which item to award based on rotation
    // Normalize rotation to 0-2π
    const normalizedRotation = currentRotation.value % (2 * Math.PI)
    const angleStep = (2 * Math.PI) / rouletteSize.value
    
    // The item at the top (12 o'clock) is selected
    // We need to find which item is currently at angle -π/2 (top position)
    // Account for rotation: each item's current angle = originalAngle + rotation
    const topAngle = -Math.PI / 2
    
    let selectedIndex = 0
    let minDiff = Infinity
    
    for (let i = 0; i < itemPositions.value.length; i++) {
      const pos = itemPositions.value[i]
      const currentAngle = pos.angle + currentRotation.value
      const normalizedCurrent = currentAngle % (2 * Math.PI)
      if (normalizedCurrent < 0) normalizedCurrent += 2 * Math.PI
      
      const targetAngle = topAngle >= 0 ? topAngle : topAngle + 2 * Math.PI
      let diff = Math.abs(normalizedCurrent - targetAngle)
      if (diff > Math.PI) diff = 2 * Math.PI - diff
      
      if (diff < minDiff) {
        minDiff = diff
        selectedIndex = i
      }
    }
    
    const selectedItem = objectItems.value[selectedIndex]
    selectedItemId.value = selectedItem.id
    
    // con el set lo añades al inventario que es un array vacio y iras metiendo todo 
    setTimeout(() => {
      store.inventory.push({ ...selectedItem })
      selectedItemId.value = null
      isSpinning.value = true
    }, 1500)
  }
}

intervalId = setInterval(checkRoundAward, 1000)

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (intervalId) {
    clearInterval(intervalId)
  }
})
// esto es en plan la posicion que tiee que recorrer el circulo junto a sus objetos
const getItemStyle = (position) => {
  const radius = 120 
  const rotateAngle = currentRotation.value
  
  const baseX = Math.cos(position.angle) * radius
  const baseY = Math.sin(position.angle) * radius
  
  const cos = Math.cos(rotateAngle)
  const sin = Math.sin(rotateAngle)
  
  const rotatedX = baseX * cos - baseY * sin
  const rotatedY = baseX * sin + baseY * cos
  
  return {
    transform: `translate(${rotatedX}px, ${rotatedY}px) rotate(${rotateAngle + position.angle}rad)`
  }
}

const centerCircleStyle = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, #2b1f3c 0%, #1a1025 100%)',
  border: '3px solid var(--color-stitch, #8b6914)',
  boxShadow: '0 0 20px rgba(139, 105, 20, 0.5)'
}
</script>

<template>
  <div class="roulette-container">
    <div class="roulette-area">
      <div 
        v-for="(pos, index) in itemPositions" 
        :key="pos.item.id"
        class="roulette-item"
        :class="{ 'is-selected': selectedItemId === pos.item.id }"
        :style="getItemStyle(pos)"
      >
        <div class="item-icon-wrapper">
          <img :src="pos.item.img" :alt="pos.item.name" class="item-icon" />
        </div>
      </div>
      
      <div class="center-circle" :style="centerCircleStyle">
        <span v-if="selectedItemId" class="selected-indicator"><img src="../assets/logo.png" alt="logo" /></span>
      </div>
    </div>
    
  
  </div>
</template>

<style scoped>
.roulette-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
 
}

.roulette-area {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.roulette-item {
  position: absolute;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.05s linear;
  will-change: transform;
}

.item-icon-wrapper {
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #444;
}

.item-icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.8));
}

.roulette-item.is-selected .item-icon-wrapper {
  border-color: #ffd700;
  box-shadow: 0 0 15px #ffd700, 0 0 30px rgba(255, 215, 0, 0.5);
  transform: scale(1.2);
  z-index: 10;
}

.center-circle {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
}

.selected-indicator {
  color: #ffd700;
  font-size: 24px;
  text-shadow: 0 0 10px #ffd700;
  animation: pulse 0.5s ease-in-out infinite alternate;
}

@keyframes pulse {
  from {
    opacity: 0.6;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1.1);
  }
}

.roulette-info {
  text-align: center;
  color: #fff;
}

.roulette-info h3 {
  margin: 0 0 0.5rem 0;
  font-family: var(--title-font, sans-serif);
  color: var(--color-toxic, #39ff14);
  text-shadow: 2px 2px 0 #000;
  font-size: 1.5rem;
}

.round-info {
  margin: 0.25rem 0;
  font-size: 1rem;
  color: #ccc;
}

.award-msg {
  margin: 0.5rem 0 0 0;
  color: #ffd700;
  font-weight: bold;
  font-size: 1.1rem;
  text-shadow: 1px 1px 0 #000;
  animation: glow 1s ease-in-out infinite alternate;
}

.wait-msg {
  margin: 0.5rem 0 0 0;
  color: #888;
  font-size: 0.9rem;
}

@keyframes glow {
  from {
    text-shadow: 0 0 5px #ffd700, 0 0 10px #ffd700;
  }
  to {
    text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ff8c00;
  }
}
</style>
