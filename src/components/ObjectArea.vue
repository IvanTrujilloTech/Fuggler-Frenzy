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
  const itemData = event.dataTransfer.getData("item");
  if (!itemData) return;
  
  const sourceItem = JSON.parse(itemData);
  
  // No combinar consigo mismo
  if (sourceItem.instanceId === targetItem.instanceId) return;

  const result = combineItems(sourceItem.id, targetItem.id);

  if (result) {
    // eliminar ambos
    store.inventory = store.inventory.filter(i => 
      i.instanceId !== sourceItem.instanceId && 
      i.instanceId !== targetItem.instanceId
    );

    // añadir artefacto
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
        <div class="object"
             draggable="true"
             @dragstart="e => onDragStart(e, element)"
             @dragover.prevent
             @drop="e => onDropItem(e, element)">
          <img :src="element.img" :title="element.name" />
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

.object {
  width: 60px;
  height: 60px;
  cursor: grab;
  background: rgba(0,0,0,0.4);
  border-radius: 8px;
  border: 2px dashed #a855f7;
  padding: 4px;
}

.object:active {
  cursor: grabbing;
}

.object img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none; /* para que el drag y drop funcione bien en el div */
}
</style>