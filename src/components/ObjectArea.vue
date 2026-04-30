<script setup>
import { useGameStore } from "../stores/gameStore";
import { ref } from "vue";
import { combineItems } from "../data/items";

const store = useGameStore()
const draggedItem = ref(null);
const draggedIndex = ref(-1);
const hoveredSlot = ref(-1);
const previewArtifact = ref(null);

function onDragStart(event, item, index) {
  // Configurar el item para que FugglerTooltip lo pueda leer al soltar
  event.dataTransfer.setData("item", JSON.stringify(item));
  event.dataTransfer.setData("sourceIndex", index.toString());
  draggedItem.value = item;
  draggedIndex.value = index;
}

function onDragEnd() {
  draggedItem.value = null;
  draggedIndex.value = -1;
  hoveredSlot.value = -1;
  previewArtifact.value = null;
}

function onDragOverSlot(event, targetItem, index) {
  // Allow drop si estamos arrastrando un objeto
  if (draggedItem.value) {
    event.preventDefault();
  }

  if (hoveredSlot.value !== index) {
    hoveredSlot.value = index;
    if (draggedItem.value && targetItem && draggedItem.value.instanceId !== targetItem.instanceId) {
      previewArtifact.value = combineItems(draggedItem.value.id, targetItem.id);
    } else {
      previewArtifact.value = null;
    }
  }
}

function onDragLeaveSlot(index) {
  if (hoveredSlot.value === index) {
    hoveredSlot.value = -1;
    previewArtifact.value = null;
  }
}

function onDropSlot(event, targetItem, targetIndex) {
  event.preventDefault();
  onDragLeaveSlot(targetIndex);
  
  const itemData = event.dataTransfer.getData("item");
  if (!itemData) return;
  const sourceItem = JSON.parse(itemData);
  const sourceIndexStr = event.dataTransfer.getData("sourceIndex");
  const sourceIndex = sourceIndexStr ? parseInt(sourceIndexStr) : -1;

  // Evitar soltar sobre sí mismo
  if (targetItem && sourceItem.instanceId === targetItem.instanceId) return;

  if (targetItem) {
    const result = combineItems(sourceItem.id, targetItem.id);
    if (result) {
      // Remover source
      if (sourceIndex !== -1) {
        store.inventory[sourceIndex] = null;
      }
      
      // Crear artefacto en target
      store.inventory[targetIndex] = {
        ...result,
        instanceId: crypto.randomUUID(),
        type: "artifact"
      };
    } else {
      // Intercambiar si no son combinables
      if (sourceIndex !== -1) {
        store.inventory[sourceIndex] = targetItem;
        store.inventory[targetIndex] = sourceItem;
      }
    }
  } else {
    // Mover a slot vacío
    if (sourceIndex !== -1) {
      store.inventory[sourceIndex] = null;
      store.inventory[targetIndex] = sourceItem;
    }
  }
}
</script>

<template>
  <div class="object-area">
    <div class="inventory-grid">
      <div 
        v-for="(item, index) in store.inventory" 
        :key="index"
        class="slot-wrapper"
        @dragover="e => onDragOverSlot(e, item, index)"
        @dragleave="onDragLeaveSlot(index)"
        @drop="e => onDropSlot(e, item, index)"
      >
        <!-- Slot Vacío -->
        <div v-if="!item" class="object-slot empty"></div>
        
        <!-- Slot Ocupado -->
        <div v-else 
             class="object-slot full"
             draggable="true"
             @dragstart="e => onDragStart(e, item, index)"
             @dragend="onDragEnd">
          <img :src="item.img" />
          
          <!-- Tooltip Normal del Objeto (solo si no estamos combinando aquí) -->
          <div class="object-tooltip" v-if="hoveredSlot !== index || !previewArtifact">
            <div class="tooltip-name" :class="{'text-gold': item.type === 'artifact'}">{{ item.name }}</div>
            <div class="tooltip-desc">{{ item.description }}</div>
            <div v-if="item.lore" class="tooltip-lore">"{{ item.lore }}"</div>
          </div>
        </div>

        <!-- Tooltip de Previsualización de Combinación -->
        <div class="preview-tooltip" v-if="hoveredSlot === index && previewArtifact">
          <div class="preview-header">Fusión Posible</div>
          <div class="preview-content">
            <img :src="previewArtifact.img" class="preview-img" />
            <div class="preview-info">
              <div class="tooltip-name text-gold">{{ previewArtifact.name }}</div>
              <div class="tooltip-desc">{{ previewArtifact.description }}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.object-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  max-height: 400px;
  overflow: hidden;
  background: rgba(0,0,0,0.2);
  padding: 8px;
  border-radius: 12px;
  border: 2px solid #2a251f;
}

.slot-wrapper {
  position: relative;
  width: 60px;
  height: 60px;
}

.object-slot {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  padding: 4px;
  box-sizing: border-box;
  transition: all 0.2s;
}

.object-slot.empty {
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(255, 255, 255, 0.2);
}

.slot-wrapper:hover .object-slot.empty {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.object-slot.full {
  cursor: grab;
  background: rgba(0,0,0,0.6);
  border: 2px dashed #a855f7;
}

.object-slot.full:active {
  cursor: grabbing;
}

.object-slot img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

/* Tooltips */
.object-tooltip, .preview-tooltip {
  position: absolute;
  left: calc(100% + 15px);
  top: 50%;
  transform: translateY(-50%);
  background: rgba(15, 15, 20, 0.95);
  padding: 12px;
  border-radius: 8px;
  width: 220px;
  z-index: 1000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
  box-shadow: 0 4px 20px rgba(0,0,0,0.8);
}

.object-tooltip {
  border: 2px solid #a855f7;
}

.preview-tooltip {
  border: 2px solid #ffd700;
  opacity: 1; 
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.slot-wrapper:hover .object-tooltip {
  opacity: 1;
}

.tooltip-name {
  color: #fff;
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.text-gold {
  color: #ffd700 !important;
}

.tooltip-desc {
  color: #4ade80;
  font-size: 0.8rem;
  margin-bottom: 6px;
}

.tooltip-lore {
  color: #94a3b8;
  font-size: 0.7rem;
  font-style: italic;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 4px;
}

/* Estilos de la preview */
.preview-header {
  color: #ffd700;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 8px;
  border-bottom: 1px dashed rgba(255,215,0,0.5);
  padding-bottom: 4px;
  text-align: center;
}

.preview-content {
  display: flex;
  gap: 10px;
  align-items: center;
}

.preview-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  background: rgba(0,0,0,0.5);
  border-radius: 4px;
  border: 1px solid #ffd700;
  padding: 2px;
}

.preview-info {
  flex: 1;
}
</style>