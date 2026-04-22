<script setup>
import { useGameStore } from '../stores/gameStore'
import draggable from 'vuedraggable'
import FugglerUnit from './FugglerUnit.vue'

const store = useGameStore()

const getInventoryGroupOptions = () => {
  return {
    name: 'fugglers',
    put: () => true
  }
}
</script>

<template>
  <div class="object-area">
    <draggable
      v-model="store.inventory"
      :group="getInventoryGroupOptions()"
      item-key="instanceId"
      class="inventory-stack"
    >
      <template #item="{ element }">
        <div class="stacked-unit">
          <FugglerUnit :fuggler="element" :minimal="true" />
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
  justify-content: flex-start;
  min-width: 80px;
  padding: 0.5rem;
}

.inventory-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.stacked-unit {
  width: 60px;
  height: 60px;
  margin-top: -40px;
  transition: transform 0.2s;
}

.stacked-unit:first-child {
  margin-top: 0;
}

.stacked-unit:hover {
  transform: scale(1.1);
  z-index: 10;
}
</style>