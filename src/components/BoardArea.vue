<script setup>
import { useGameStore } from '../stores/gameStore'
import draggable from 'vuedraggable'
import FugglerUnit from './FugglerUnit.vue'

const store = useGameStore()

const getBoardGroupOptions = (index) => {
  return {
    name: 'fugglers',
    put: (to, from) => {
      // si la casilla ya tiene un fuggler, no se puede soltar
      if (store.board[index].length >= 1) return false;
      // si viene del banquillo y ya hay 6 fugglers en tablero, bloquear
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
  // Convert row, col to q, r
  const r = row
  const q = col - Math.floor(row / 2)
  return store.combatUnits.find(u => u.pos.q === q && u.pos.r === r && !u.isDead)
}

</script>

<template>
  <div class="board-area">
    <div class="board-header">
      <div class="active-count">
        <span class="count-label">Fugglers:</span>
        <span class="count-value" :class="{ 'at-limit': store.activeBoardUnits >= 6 }">{{ store.activeBoardUnits }} / 6</span>
      </div>
    </div>

    <div class="unified-board" :class="{ 'is-combat': store.phase === 'COMBAT' }">
      <!-- Un solo bucle de 6 filas (0-2: Enemigo, 3-5: Jugador) -->
      <div class="hex-row" v-for="rowIdx in 6" :key="'row-'+rowIdx">
        
        <!-- Renderizado de CELDAS (Planning Phase) -->
        <template v-if="store.phase !== 'COMBAT'">
          <!-- Si es fila 0,1,2 (Enemigo) -->
          <template v-if="rowIdx <= 3">
            <div 
              class="hex-slot is-hex enemy-slot" 
              v-for="colIdx in 7" 
              :key="'e-col-'+colIdx"
            >
              <FugglerUnit v-if="store.boardEnemy[(rowIdx-1)*7 + (colIdx-1)]?.length > 0" :fuggler="store.boardEnemy[(rowIdx-1)*7 + (colIdx-1)][0]" />
            </div>
          </template>

          <!-- Si es fila 3,4,5 (Jugador) -->
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

        <!-- Renderizado de COMBATE (Basado en combatUnits) -->
        <template v-else>
          <div 
            v-for="colIdx in 7" 
            :key="'c-col-'+colIdx"
            class="hex-slot is-hex"
            :class="rowIdx <= 3 ? 'enemy-slot' : 'board-slot'"
          >
            <div v-if="getFugglerOnCombatHex(rowIdx-1, colIdx-1)" class="combat-unit-wrapper">
              <FugglerUnit 
                :fuggler="getFugglerOnCombatHex(rowIdx-1, colIdx-1)" 
                :class="{ 'is-attacking': getFugglerOnCombatHex(rowIdx-1, colIdx-1).isAttacking }"
              />
              <div class="hp-bar-container">
                <div class="hp-bar-fill" :style="{ width: (getFugglerOnCombatHex(rowIdx-1, colIdx-1).hp / getFugglerOnCombatHex(rowIdx-1, colIdx-1).maxHp * 100) + '%' }"></div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="bench-area">
      <h2>Banquillo</h2>
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
.board-area {
  flex-grow: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  overflow-y: auto;
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
  justify-content: center;
  margin-bottom: -22px; /* superposicion vertical para encajar hexagonos */
}
/* indentar las filas pares para formar el panal de hexagonos */
.hex-row:nth-child(even) {
  margin-left: 90px; 
}

.hex-row {
  display: flex;
  justify-content: center;
  margin-bottom: -24px; /* Ajuste para que encajen mejor */
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
  padding: 40px;
  background: rgba(0,0,0,0.3);
  border-radius: 50px;
  transition: all 0.5s ease;
}

.unified-board.is-combat {
  background: rgba(139, 0, 0, 0.1);
  box-shadow: inset 0 0 100px rgba(255,0,0,0.1);
}

.enemy-slot {
  background: repeating-linear-gradient(45deg, #3c1f1f, #3c1f1f 5px, #4a2929 5px, #4a2929 10px) !important;
  border: 2px solid rgba(255, 0, 0, 0.2);
}

.board-slot {
  background: repeating-linear-gradient(45deg, #1f2b3c, #1f2b3c 5px, #29364a 5px, #29364a 10px) !important;
  border: 2px solid rgba(0, 255, 255, 0.1);
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
  .hex-row:nth-child(even) {
    margin-left: 65px;
  }
}

.hex-slot {
  width: 80px;
  height: 92px;
  margin: 0 5px;
  background: repeating-linear-gradient(45deg, #1f1f1f, #1f1f1f 5px, #262626 5px, #262626 10px);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  transition: transform 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .hex-slot {
    width: 60px;
    height: 69px;
    margin: 0 3px;
  }
}

@media (max-width: 450px) {
  .hex-slot {
    width: 38px;
    height: 44px;
    margin: 0 1px;
  }
  .hex-row {
    margin-bottom: -10px;
  }
  .hex-row:nth-child(even) {
    margin-left: 40px;
  }
  .board-title {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
}
.player-board .hex-slot {
  background: repeating-linear-gradient(45deg, #2b1f3c, #2b1f3c 5px, #36294a 5px, #36294a 10px);
}
.player-board .hex-slot:hover {
  transform: scale(1.1);
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
