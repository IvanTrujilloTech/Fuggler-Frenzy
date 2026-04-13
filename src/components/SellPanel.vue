<script setup>
import { ref, onMounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import Sortable from 'sortablejs'

const store = useGameStore()
const sellZoneEl = ref(null)
const isDragOver = ref(false)
let dragOverCounter = 0

onMounted(() => {
  if (!sellZoneEl.value) return

  // sortable crudo en vez del componente vuedraggable.
  // motivo: el hook `updated` de vuedraggable se ejecuta DENTRO del ciclo de
  // patch de vue e intenta escribir `__draggable_context` en nodos del dom que
  // ya pueden haber sido eliminados por el desmontaje reactivo → crash.
  // usar sortable directamente evita ese ciclo de vida por completo.
  Sortable.create(sellZoneEl.value, {
    group: {
      name: 'fugglers',
      // solo se aceptan drops que vengan de un bench-slot
      put: (to, from) => from.el.classList.contains('bench-slot'),
      pull: false,
    },
    onAdd(evt) {
      // sortable ya ha sacado el elemento del sortable del banquillo.
      // vuedraggable en el banquillo escucha el evento 'remove' de sortable
      // y ya ha actualizado store.bench[idx] antes de que esto se ejecute.
      const unit = store.draggingUnit

      // elimina el nodo del dom de inmediato — no queremos que se quede en la zona de venta.
      evt.item.remove()

      if (unit) {
        store.gold += unit.cost
        store.checkUpgrades()
      }

      store.draggingUnit = null
      isDragOver.value = false
      dragOverCounter = 0 // reinicia el contador del drag
    },
  })
})

function onDragEnter() {
  dragOverCounter++
  isDragOver.value = true
}

function onDragLeave() {
  dragOverCounter--
  if (dragOverCounter <= 0) {
    dragOverCounter = 0
    isDragOver.value = false
  }
}
</script>

<template>
  <div class="sell-panel">
    <div
      class="sell-drop-wrapper"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
    >
      <div
        ref="sellZoneEl"
        class="sell-drop-zone"
        :class="{ 'sell-drop-zone--over': isDragOver }"
      >
        <div class="sell-drop-inner">
          <span class="sell-label">{{ isDragOver ? '¡Suelta!' : 'Arrastra\naquí' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sell-panel {
  width: 110px;
  min-width: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 0.5rem;
  background: repeating-linear-gradient(
    135deg,
    #1a0d0d,
    #1a0d0d 8px,
    #200f0f 8px,
    #200f0f 16px
  );
  border-left: 5px dashed #e63946;
  box-shadow: -6px 0 20px rgba(230, 57, 70, 0.2);
}

.sell-panel-title {
  font-family: var(--title-font);
  font-size: 1rem;
  letter-spacing: 3px;
  color: #ff6b6b;
  text-shadow: 2px 2px 0 #000;
  transform: rotate(-90deg);
  white-space: nowrap;
  margin-bottom: 0.5rem;
}

/* ── Drop zone wrapper: handles drag enter/leave for visual feedback ── */
.sell-drop-wrapper {
  width: 84px;
  height: 180px;
  border-radius: 6px 18px 5px 14px;
  display: flex;
  align-items: stretch;
}

.sell-drop-zone {
  flex: 1;
  border: 3px dashed #e63946;
  border-radius: 6px 18px 5px 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(230, 57, 70, 0.06);
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.15s;
  animation: pulse-sell 1.5s ease-in-out infinite;
  cursor: default;
  min-height: 140px;
}

.sell-drop-zone--over {
  background: rgba(230, 57, 70, 0.28);
  border-color: #ff6b6b;
  box-shadow: 0 0 30px rgba(255, 107, 107, 0.7), inset 0 0 20px rgba(255, 107, 107, 0.15);
  transform: scale(1.06);
  animation: none;
}

@keyframes pulse-sell {
  0%, 100% { box-shadow: 0 0 8px rgba(230, 57,  70, 0.2); }
  50%       { box-shadow: 0 0 22px rgba(230, 57, 70, 0.6); }
}

.sell-drop-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  pointer-events: none;
  user-select: none;
}

.sell-icon {
  font-size: 2rem;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
  transition: transform 0.2s;
}

.sell-drop-zone--over .sell-icon {
  transform: scale(1.3) rotate(-10deg);
}

.sell-label {
  font-family: var(--title-font);
  font-size: 0.7rem;
  letter-spacing: 1px;
  color: #ff6b6b;
  text-shadow: 1px 1px 0 #000;
  text-transform: uppercase;
  text-align: center;
  white-space: pre-line;
}

.coin-hint {
  width: 18px;
  height: 18px;
  opacity: 0.7;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6));
}

.sell-note {
  font-family: var(--number-font);
  font-size: 0.6rem;
  color: #666;
  text-align: center;
  line-height: 1.4;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
