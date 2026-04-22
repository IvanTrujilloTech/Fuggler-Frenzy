<script setup>
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()

function pick(option) {
  // solo en planning
  if (store.phase !== 'PLANNING') return

  // buscar slot libre en bench
  const emptySlotIndex = store.bench.findIndex(slot => slot.length === 0)
  if (emptySlotIndex === -1) return

  // límite de 6 objetos
  if (store.inventory.length >= 6) return

  // añadir fuggler al bench (respetando tu estructura)
  store.bench[emptySlotIndex].push({
    ...option.fuggler,
    instanceId: crypto.randomUUID(),
    stars: 1,
    items: []
  })

  // añadir objeto al inventario
  store.inventory.push({
    ...option.object,
    instanceId: crypto.randomUUID()
  })

  // cerrar evento
  store.planningEventActive = false
  store.planningOptions = []
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