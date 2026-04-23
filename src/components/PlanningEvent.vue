<script setup>
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()


const pick = (option) => {
  // solo en planning
  if (store.phase !== 'PLANNING') return

  // buscar slot libre en bench
  const emptySlotIndex = store.bench.findIndex(slot => slot.length === 0)
  if (emptySlotIndex === -1) return

  // límite de 6 objetos en inventario
  if (store.inventory.length >= 6) return

  // crear fuggler (sin objeto)
  const fuggler = {
    ...option.fuggler,
    instanceId: crypto.randomUUID(),
    items: [],
    stars: 1
  }

  // añadir fuggler al bench
  store.bench[emptySlotIndex].push(fuggler)

  // crear objeto y añadirlo al inventario (para equipar manualmente después)
  const item = {
    ...option.object,
    instanceId: crypto.randomUUID()
  }
  store.addItemToInventory(item)

  // cerrar evento y seguir
  store.planningEventActive = false
  store.planningOptions = []
  store.startTimer()
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
/* contenedor de las 3 cartas */
.container-wrapper {
  display: flex;
  flex-direction: row;
  gap: 40px;
}

/* cada carta */
.container {
  width: 180px;
  height: 220px;
  background: #1e1e1e;
  border: 3px dotted #fff;
  border-radius: 12px;
  padding: 12px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* hover tipo juego */
.container:hover {
  transform: scale(1.08);
  box-shadow: 0 0 15px rgba(255,255,255,0.3);
}

/* fuggler centrado */
.fuggler {
  width: 110px;
  height: 110px;
  object-fit: contain;
}

/* objeto a la derecha */
.object {
  position: absolute;
  right: 8px;
  bottom: 8px;

  width: 40px;
  height: 40px;
  object-fit: contain;
}
.container {
  border: 3px dotted #ccc;
}

.container:nth-child(1) { border-color: #aaa; }
.container:nth-child(2) { border-color: #4ade80; }
.container:nth-child(3) { border-color: #60a5fa; }
</style>
