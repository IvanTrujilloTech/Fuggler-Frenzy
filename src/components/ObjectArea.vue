<script setup>
import { useGameStore } from "../stores/gameStore";
import draggable from "vuedraggable";
import FugglerUnit from "./FugglerUnit.vue";

const store = useGameStore();

const getInventoryGroupOptions = () => {
  return {
    name: "fugglers",
    put: () => true,
  };
};
function tryCombine(obj1, obj2) {
  for (const [name, artefact] of Object.entries(ARTEFACTOS)) {
    const r = artefact.receta;

    if (
      (obj1.name.includes(r.obj1) && obj2.name.includes(r.obj2)) ||
      (obj1.name.includes(r.obj2) && obj2.name.includes(r.obj1))
    ) {
      return {
        name,
        ...artefact,
        instanceId: crypto.randomUUID(),
        isArtefact: true,
      };
    }
  }

  return null;
}
function onDropObject(targetObj, draggedObj) {
  const result = tryCombine(targetObj, draggedObj);

  if (result) {
    // eliminar los dos
    store.objects = store.objects.filter(
      (o) =>
        o.instanceId !== targetObj.instanceId &&
        o.instanceId !== draggedObj.instanceId
    );

    // añadir artefacto
    store.objects.push(result);
  }
}
function handleDrop(evt) {
  const dragged = evt.item.__vueParentComponent.props.element

  // buscar si se ha soltado encima de otro
  const target = store.objects.find(o => o !== dragged)

  if (!target) return

  const result = tryCombine(dragged, target)

  if (result) {
    store.objects = store.objects.filter(
      o => o.instanceId !== dragged.instanceId &&
           o.instanceId !== target.instanceId
    )

    store.objects.push(result)
  }
}
</script>

<template>
  <div class="object-area">
    <draggable
      v-model="store.objects"
      group="objects"
      item-key="instanceId"
      class="inventory-stack"
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
