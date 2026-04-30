<script setup>
import { useGameStore } from '../stores/gameStore'
import draggable from 'vuedraggable'
import FugglerUnit from './FugglerUnit.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const store = useGameStore()

const zoom = ref(1)
const targetZoom = ref(1)

const maxZoom = 2.2

const pan = ref({ x: 0, y: 0 })
const isPanning = ref(false)
const lastMouse = ref({ x: 0, y: 0 })

const boardViewport = ref(null)


let animationFrame = null

const animateZoom = () => {
  zoom.value += (targetZoom.value - zoom.value) * 0.12

  if (Math.abs(targetZoom.value - zoom.value) > 0.001) {
    animationFrame = requestAnimationFrame(animateZoom)
  } else {
    animationFrame = null
  }
}


const onWheel = (e) => {
  e.preventDefault()

  const zoomIntensity = 0.002
  const delta = -e.deltaY * zoomIntensity

  let newZoom = targetZoom.value + delta

  // 🔥 CLAVE: nunca bajar de 1
  if (newZoom < 1) newZoom = 1
  if (newZoom > maxZoom) newZoom = maxZoom

  if (newZoom === targetZoom.value) return

  const rect = boardViewport.value.getBoundingClientRect()

  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  const scaleChange = newZoom / targetZoom.value

  pan.value.x = mouseX - (mouseX - pan.value.x) * scaleChange
  pan.value.y = mouseY - (mouseY - pan.value.y) * scaleChange

  targetZoom.value = newZoom

  if (!animationFrame) animateZoom()
}

const onMouseDown = (e) => {
  if (e.button !== 1) return
  if (zoom.value <= 1) return

  isPanning.value = true
  lastMouse.value = { x: e.clientX, y: e.clientY }
}

const onMouseMove = (e) => {
  if (!isPanning.value) return

  const dx = e.clientX - lastMouse.value.x
  const dy = e.clientY - lastMouse.value.y

  pan.value.x += dx
  pan.value.y += dy

  lastMouse.value = { x: e.clientX, y: e.clientY }
}

const onMouseUp = () => {
  isPanning.value = false
}

onMounted(() => {
  window.addEventListener('mouseup', onMouseUp)
})

onBeforeUnmount(() => {
  window.removeEventListener('mouseup', onMouseUp)
})

/* =========================
  esto es el codigo original antes del zoomL
========================= */

const getBoardGroupOptions = (index) => {
  return {
    name: 'fugglers',
    put: (to, from) => {
      if (store.board[index].length >= 1) return false;
      const isFromBench = from.el.classList.contains('bench-slot');
      if (isFromBench && store.activeBoardUnits >= 6) return false;
      return true;
    }
  }
}

const getBenchGroupOptions = (index) => {
  return {
    name: 'fugglers',
    put: () => {
      return store.bench[index].length === 0;
    }
  }
}

const getFugglerOnCombatHex = (row, col) => {
  const r = row
  const q = col - Math.floor(row / 2)
  return store.combatUnits.find(u => u.pos.q === q && u.pos.r === r && !u.isDead)
}

const getUnitStyle = (unit) => {
  const r = unit.pos.r
  const c = unit.pos.q + Math.floor(r / 2)

  return {
    top: `calc(var(--board-padding) + ${r} * (var(--hex-h) - var(--hex-overlap)))`,
    left: `calc(var(--board-padding) + ${c} * (var(--hex-w) + 2 * var(--hex-margin)) + (${r % 2 === 1 ? 'var(--row-shift)' : '0px'}))`,
    zIndex: r + 10
  }
}
</script>

<template>
  <div class="board-area">
    
    <div class="board-header">
      <div class="active-count">
        <span class="count-label">Fugglers:</span>
        <span class="count-value" :class="{ 'at-limit': store.activeBoardUnits >= 6 }">
          {{ store.activeBoardUnits }} / 6
        </span>
      </div>
    </div>

    <div 
      class="board-viewport"
      ref="boardViewport"
      @wheel="onWheel"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
    >
      <div 
        class="board-transform"
        :style="{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
        }"
      >
        <div class="unified-board" :class="{ 'is-combat': store.phase === 'COMBAT', 'is-dragging': store.draggingUnit }">

          <div class="hex-row" v-for="rowIdx in 6" :key="'row-'+rowIdx">
            
            <template v-if="store.phase !== 'COMBAT'">

              <template v-if="rowIdx <= 3">
                <div 
                  class="hex-slot is-hex enemy-slot" 
                  v-for="colIdx in 7" 
                  :key="'e-col-'+colIdx"
                >
                  <FugglerUnit 
                    v-if="store.boardEnemy[(rowIdx-1)*7 + (colIdx-1)]?.length > 0" 
                    :fuggler="store.boardEnemy[(rowIdx-1)*7 + (colIdx-1)][0]" 
                  />
                </div>
              </template>

              <template v-else>
                <draggable
                  v-for="colIdx in 7"
                  :key="'p-col-'+colIdx"
                  v-model="store.board[(rowIdx-4)*7 + (colIdx-1)]"
                  :group="getBoardGroupOptions((rowIdx-4)*7 + (colIdx-1))"
                  item-key="instanceId"
                  class="hex-slot is-hex board-slot"
                >
                  <template #item="{ element }">
                    <FugglerUnit :fuggler="element" />
                  </template>
                </draggable>
              </template>

            </template>

            <template v-else>
              <div 
                v-for="colIdx in 7" 
                :key="'c-col-'+colIdx"
                class="hex-slot is-hex"
                :class="rowIdx <= 3 ? 'enemy-slot' : 'board-slot'"
              ></div>
            </template>

          </div>

          <!-- COMBAT LAYER -->
          <div v-if="store.phase === 'COMBAT'" class="combat-absolute-layer">
            <div 
              v-for="unit in store.combatUnits.filter(u => !u.isDead)" 
              :key="unit.instanceId"
              class="combat-unit-absolute is-hex"
              :style="getUnitStyle(unit)"
              :class="{ 
                'is-attacking': unit.isAttacking,
                'enemy-slot': unit.side === 'enemy',
                'board-slot': unit.side === 'player'
              }"
            >
              <FugglerUnit :fuggler="unit" />
              <div class="hp-bar-container">
                <div class="hp-bar-fill" :style="{ width: (unit.hp / unit.maxHp * 100) + '%' }"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- BENCH -->
    <div class="bench-area">
      <div class="bench-grid">
        <draggable
          v-for="(slot, idx) in store.bench"
          :key="'bench-'+idx"
          v-model="store.bench[idx]"
          :group="getBenchGroupOptions(idx)"
          item-key="instanceId"
          class="bench-slot"
          @start="() => { store.draggingUnit = store.bench[idx][0] ?? null }"
          @end="store.draggingUnit = null"
        >
          <template #item="{ element }">
            <FugglerUnit :fuggler="element" />
          </template>
        </draggable>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* 🔥 ZOOM SYSTEM */
.board-viewport {
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: grab;
  position: relative;
}

.board-viewport:active {
  cursor: grabbing;
}

.board-transform {
  transform-origin: 0 0;
  will-change: transform;
    transition: transform 0.08s linear; 
}



.board-area::-webkit-scrollbar {
  display: none;
}
.board-area {
  --hex-w: 80px;
  --hex-h: 92px;
  --hex-margin: 5px;
  --hex-overlap: 24px;
  --row-shift: 45px;
  --board-padding: 20px 40px;
flex-direction: flex-start;
  flex-grow: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  overflow-y: auto;
   scrollbar-width: none;       
  -ms-overflow-style: none;   
}
.board-area::-webkit-scrollbar {
  display: none;               /* Chrome, Safari */
}
/* Tablero Hexagonal */
.hex-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
  position: relative;
}

.enemy-board {
  opacity: 0.8;
  transform: scale(0.9);
}

.board-title {
  color: var(--color-toxic);
  font-family: var(--title-font);
  font-size: 2rem;
  letter-spacing: 2px;
  text-shadow: 3px 3px 0px #000;
  margin-bottom: 20px;
  transform: rotate(-1deg);
}

.hex-row {
  display: flex;
  justify-content: flex-start;
  margin-bottom: calc(-1 * var(--hex-overlap));
}

.hex-row:nth-child(even) {
  padding-left: var(--row-shift);
}


.board-header {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 0 20px;
}

.active-count {
  background: #222;
  padding: 10px 20px;
  border: 3px solid #000;
  border-radius: 8px 15px 4px 10px;
  transform: rotate(-2deg);
  box-shadow: 4px 4px 0 rgba(0,0,0,1);
  display: flex;
  gap: 10px;
  font-family: var(--title-font);
}

.count-label {
  color: #888;
}

.count-value {
  color: var(--color-toxic);
  font-family: var(--number-font);
  font-size: 1.2rem;
}

.count-value.at-limit {
  color: #ff4444;
}

.unified-board {
  display: flex;
  flex-direction: column;
  padding: var(--board-padding);
  background: rgba(0,0,0,0.3);
  border-radius: 50px;
  transition: all 0.5s ease;
  position: relative;
  width: fit-content;
  margin: 0 auto;
}

.unified-board.is-combat {
  background: rgba(139, 0, 0, 0.1);
  box-shadow: inset 0 0 100px rgba(255,0,0,0.1);
}

.enemy-slot {
  background: repeating-linear-gradient(45deg, #3c1f1f, #3c1f1f 5px, #4a2929 5px, #4a2929 10px) !important;
  border: 2px solid rgba(255, 0, 0, 0.2);
}

.is-dragging .enemy-slot {
  pointer-events: none;
}

.board-slot {
  background: repeating-linear-gradient(45deg, #1f2b3c, #1f2b3c 5px, #29364a 5px, #29364a 10px) !important;
  border: 2px solid rgba(0, 255, 255, 0.1);
}

.hex-slot {
  width: var(--hex-w);
  height: var(--hex-h);
  margin: 0 var(--hex-margin);
  background: repeating-linear-gradient(45deg, #1f1f1f, #1f1f1f 5px, #262626 5px, #262626 10px);
  -webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  justify-content: center;
  align-items: center;
}

.combat-absolute-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.combat-unit-absolute {
  position: absolute;
  width: var(--hex-w);
  height: var(--hex-h);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.45s ease-in-out;
  padding-top: 10px;
  -webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

.combat-unit-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.hp-bar-container {
  position: absolute;
  top: 10px;
  width: 50px;
  height: 6px;
  background: #333;
  border: 1px solid #000;
  border-radius: 3px;
  overflow: hidden;
}

.hp-bar-fill {
  height: 100%;
  background: var(--color-toxic);
  transition: width 0.3s ease;
}

.is-attacking {
  animation: attack-nudge 0.3s ease-out;
}

@keyframes attack-nudge {
  0% { transform: scale(1); }
  50% { transform: scale(1.2) translateY(-10px); }
  100% { transform: scale(1); }
}

@media (max-width: 768px) {
  .board-area {
    --hex-w: 60px;
    --hex-h: 69px;
    --hex-margin: 3px;
    --hex-overlap: 18px;
    --row-shift: 33px;
    --board-padding: 30px;
  }
}

@media (max-width: 450px) {
  .board-area {
    --hex-w: 38px;
    --hex-h: 44px;
    --hex-margin: 1px;
    --hex-overlap: 11px;
    --row-shift: 20px;
    --board-padding: 20px;
  }
  .board-title {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
}
/*esto es portatil*/

@media (max-width: 1366px) {
  .board-area {
    --hex-w: 60px;
    --hex-h: 55px;
    --hex-margin: 3px;
    --hex-overlap: 20px;
    --row-shift: 36px;
    --board-padding: 15px 25px;
  }

  .unified-board {
    transform: scale(0.9);
    transform-origin: top center;
  }
}
@media (min-width: 1800px) {
  .board-area {
    --hex-w: 95px;
    --hex-h: 110px;
    --hex-margin: 6px;
    --hex-overlap: 28px;
    --row-shift: 52px;
    --board-padding: 30px 60px;
  }

  .unified-board {
    transform: scale(1.15);
    transform-origin: top center;
  }
}
/* banquillo normal (cuadrado) */
.bench-area {
  margin-top: auto;
  text-align: center;
  background: var(--color-felt);
  padding: 15px;
  border-radius: 4px 20px 3px 15px;
  border: 5px dashed var(--color-stitch);
  width: 100%;
  max-width: 900px;
  transform: rotate(1deg);
  box-shadow: 8px 8px 0 rgba(0,0,0,0.8);
}
.bench-area h2 {
  font-family: var(--title-font);
  font-size: 1.5rem;
  letter-spacing: 2px;
  color: var(--color-toxic);
  margin-bottom: 10px;
}
.bench-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}
.bench-slot {
  width: 80px;
  height: 80px;
  background: #111;
  border: 3px dashed var(--color-stitch);
  border-radius: 5px 12px 4px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
@media (max-width: 600px) {
  .board-title {
    font-size: 1.5rem;
  }
  .bench-slot {
    width: 60px;
    height: 60px;
  }
}
</style>
