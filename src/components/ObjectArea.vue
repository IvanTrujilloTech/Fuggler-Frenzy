<script setup>
import { useGameStore } from "../stores/gameStore";
import draggable from "vuedraggable";
import { combineItems } from "../data/items";

const store = useGameStore()

function onDragStart(event, item) {
  // Configurar el item para que FugglerTooltip lo pueda leer al soltar
  event.dataTransfer.setData("item", JSON.stringify(item));
}

function onDropItem(event, targetItem) {
  event.preventDefault();
  event.stopPropagation();
  
  const itemData = event.dataTransfer.getData("item");
  if (!itemData) return;
  
  const sourceItem = JSON.parse(itemData);
  
  // No combinar consigo mismo
  if (sourceItem.instanceId === targetItem.instanceId) return;

  const result = combineItems(sourceItem.id, targetItem.id);

  if (result) {
    // Eliminar ambos items que se combinaron
    store.inventory = store.inventory.filter(i => 
      i.instanceId !== sourceItem.instanceId && 
      i.instanceId !== targetItem.instanceId
    );

    // Añadir el artefacto resultante
    store.inventory.push({
      ...result,
      instanceId: crypto.randomUUID(),
      type: "artifact"
    });
  }
}
</script>

<template>
  <div class="object-area">
    <draggable
      v-model="store.inventory"
      group="objects"
      item-key="instanceId"
      class="inventory-stack"
    >
      <template #item="{ element }">
        <div class="object-wrapper"
             draggable="true"
             @dragstart="e => onDragStart(e, element)"
             @dragover.prevent
             @drop="e => onDropItem(e, element)">
          <div class="object">
            <img :src="element.img" />
          </div>
          
          <!-- Tooltip al pasar el ratón -->
          <div class="object-tooltip">
            <div class="tooltip-name">{{ element.name }}</div>
            <div class="tooltip-desc">{{ element.description }}</div>
            <div v-if="element.lore" class="tooltip-lore">"{{ element.lore }}"</div>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>
<style scoped>
.object-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.inventory-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 360px;
  overflow: hidden;
}

.object-wrapper {
  position: relative;
}

.object {
  width: 60px;
  height: 60px;
  cursor: grab;
  background: rgba(0,0,0,0.4);
  border-radius: 8px;
  border: 2px dashed #a855f7;
  padding: 4px;
}

.object-tooltip {
  position: absolute;
  left: calc(100% + 15px);
  top: 50%;
  transform: translateY(-50%);
  background: rgba(15, 15, 20, 0.95);
  border: 2px solid #a855f7;
  padding: 12px;
  border-radius: 8px;
  width: 200px;
  z-index: 1000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
  box-shadow: 0 4px 20px rgba(0,0,0,0.8);
}

.object-wrapper:hover .object-tooltip {
  opacity: 1;
}

.tooltip-name {
  color: #fff;
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 4px;
  text-transform: uppercase;
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

.object:active {
  cursor: grabbing;
}

.object img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}
</style>