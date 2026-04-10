<script setup>
import { useGameStore } from '../stores/gameStore'
import draggable from 'vuedraggable'
import FugglerUnit from './FugglerUnit.vue'

const store = useGameStore()

const getBoardGroupOptions = (index) => {
  return {
    name: 'fugglers',
    put: (to, from) => {
      // Si la casilla ya tiene un fuggler, no se puede soltar
      if (store.board[index].length >= 1) return false;
      // Si viene del banquillo y ya hay 6 fugglers, bloquear
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

</script>

<template>
  <div class="board-area">
    <div class="hex-board enemy-board">
      <div class="hex-row" v-for="row in 3" :key="'e-row-'+row">
        <!-- Enemy board is static for now -->
        <div 
          class="hex-slot is-hex enemy-slot" 
          v-for="col in 7" 
          :key="'e-col-'+col"
        >
          <FugglerUnit v-if="store.boardEnemy[(row-1)*7 + (col-1)]?.length > 0" :fuggler="store.boardEnemy[(row-1)*7 + (col-1)][0]" />
        </div>
      </div>
    </div>

    <div class="hex-board player-board">
      <h2 class="board-title">Tablero Aliado ({{ store.activeBoardUnits }} / 6)</h2>
      <div class="hex-row" v-for="row in 3" :key="'p-row-'+row">
        <draggable
          v-for="col in 7"
          :key="'p-col-'+col"
          v-model="store.board[(row-1)*7 + (col-1)]"
          :group="getBoardGroupOptions((row-1)*7 + (col-1))"
          item-key="instanceId"
          class="hex-slot is-hex board-slot"
        >
          <template #item="{ element }">
            <FugglerUnit :fuggler="element" />
          </template>
        </draggable>
      </div>
    </div>

    <div class="bench-area">
      <h2>Banquillo (Arrastra aquí)</h2>
      <div class="bench-grid">
        <draggable
          v-for="(slot, idx) in store.bench"
          :key="'bench-'+idx"
          v-model="store.bench[idx]"
          :group="getBenchGroupOptions(idx)"
          item-key="instanceId"
          class="bench-slot"
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
  margin-bottom: -22px; /* Superposición vertical para encajar hexagonos */
}
/* Indentar las filas pares (o impares) para formar el panal */
.hex-row:nth-child(even) {
  margin-left: 85px; 
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
.player-board .hex-slot {
  background: repeating-linear-gradient(45deg, #2b1f3c, #2b1f3c 5px, #36294a 5px, #36294a 10px);
}
.player-board .hex-slot:hover {
  transform: scale(1.1);
}

/* Banquillo Normal (Cuadrado) */
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
</style>
