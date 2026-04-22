<script setup>
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()

function pick(option) {
  // 👉 añadir fuggler al bench
  store.bench.push({
    ...option.fuggler,
    instanceId: crypto.randomUUID()
  })

  // 👉 añadir objeto al inventario
  store.objects.push({
    ...option.object,
    instanceId: crypto.randomUUID()
  })

  // 👉 cerrar evento
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
<style scoped>
.planning-event {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);

  display: flex;
  justify-content: center;
  align-items: center;
}

.container-wrapper {
  display: flex;
  gap: 40px;
}

.container {
  width: 120px;
  height: 160px;
  background: #222;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.container:hover {
  transform: scale(1.1);
}

.fuggler {
  width: 100%;
}

.object {
  width: 40px;
}
</style>