<script setup>
import { useGameStore } from "../stores/gameStore";
import draggable from "vuedraggable";
import { combineItems } from "../data/items";

const store = useGameStore()

function handleDrop() {
  if (store.inventory.length < 2) return

  const obj1 = store.inventory[store.inventory.length - 1]
  const obj2 = store.inventory[store.inventory.length - 2]

  const result = combineItems(obj1.id, obj2.id)

  if (result) {
    // eliminar los dos últimos
    store.inventory.splice(-2, 2)

    // añadir artefacto
    store.inventory.push({
      ...result,
      instanceId: crypto.randomUUID(),
      type: "artifact"
    })
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
      @end="handleDrop"
    >
      <template #item="{ element }">
        <div class="object">
          <img :src="element.img" />
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
  max-height: 360px; /* 6 objetos */
  overflow: hidden;
}

.object {
  width: 60px;
  height: 60px;
}

.object img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>