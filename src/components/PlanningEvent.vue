<script setup>
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()

function pick(option) {
  // solo en planning
  if (store.phase !== 'PLANNING') return

  store.pickPlanningOption(option);
}
</script>

<template>
  <div v-if="store.planningEventActive" class="planning-event">
    <div class="container-wrapper">
      
      <div
        v-for="option in store.planningOptions"
        :key="option.id"
        class="container"
        @click="pick(option)"
      >
        <img :src="option.fuggler.image" class="fuggler" />
        <img :src="option.object.img" class="object" />
      </div>

    </div>
  </div>
</template>