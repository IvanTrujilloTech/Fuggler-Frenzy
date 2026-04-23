<script setup>
import { useGameStore } from "../stores/gameStore";
import { ARTIFACT_RECIPES } from "../data/items";
import { ref, watch } from "vue";

const store = useGameStore();
const props = defineProps({ fuggler: { type: Object, required: true } });
const showRecipes = ref(false);

function onDragOver(event) { event.preventDefault(); }

function onDrop(event) {
  event.preventDefault();
  const itemData = event.dataTransfer.getData("item");
  if (!itemData) return;
  const item = JSON.parse(itemData);
  const success = store.equipItemToFuggler(props.fuggler.instanceId, item);
  if (success) {
    store.inventory = store.inventory.filter(i => i.instanceId !== item.instanceId);
  }
}

function unequipItem(item) {
  const fugglerItems = props.fuggler.items || [];
  const idx = fugglerItems.findIndex(i => i.instanceId === item.instanceId);
  if (idx >= 0) {
    fugglerItems.splice(idx, 1);
    store.inventory.push(item);
  }
}

function tryCraftInObjectArea() {
  const inv = store.inventory;
  if (inv.length < 2) return;
  const obj1 = inv[inv.length - 1];
  const obj2 = inv[inv.length - 2];
  const key1 = `${obj1.id}_${obj2.id}`;
  const key2 = `${obj2.id}_${obj1.id}`;
  const recipe = ARTIFACT_RECIPES[key1] || ARTIFACT_RECIPES[key2];
  if (recipe) {
    store.inventory = store.inventory.filter(i => i.instanceId !== obj1.instanceId && i.instanceId !== obj2.instanceId);
    store.inventory.push({ ...recipe, instanceId: crypto.randomUUID(), type: "artifact" });
  }
}

const ITEM_NAMES = {
  tooth: 'Diente', thread: 'Hilo', pin: 'Imperdible', sock: 'Calcetin',
  soap: 'Jabon', battery: 'Pila', ombligo: 'Pelusa', canicas: 'Canicas',
  dentadura: 'Dentadura', collar: 'Collar', mando: 'Mando', jersei: 'Jersei'
};
</script>

<template>
  <div class="tooltip-wrapper" ref="reference" @mouseenter="() => {}">
    <div class="fuggler-unit" 
      :class="`tier-${fuggler.tier}`"
      @dragover="onDragOver"
      @drop="onDrop"
    >
      <button class="btn-recipes" @click.stop="showRecipes = !showRecipes" :class="{ open: showRecipes }">📜</button>

      <div v-if="fuggler.items && fuggler.items.length > 0" class="equipped-items-side">
        <div v-for="item in fuggler.items" :key="item.instanceId"
          class="equipped-item-big" :title="`${item.name}\n${item.description}`" @click.stop="unequipItem(item)">
          <img :src="item.img" :alt="item.name" />
          <span class="item-effect">{{ item.description }}</span>
        </div>
      </div>
      
      <img v-if="fuggler.image" :src="fuggler.image" :alt="fuggler.name" class="fuggler-image" />
      <div class="items-legacy">
        <img v-for="item in fuggler.items || []" :key="item.instanceId + '-sm'" :src="item.img" class="item-icon" />
      </div>
    </div>

    <div v-if="showRecipes" class="recipes-panel">
      <h4>📜 Recetas de Artefactos</h4>
      <div class="recipes-list">
        <div v-for="(rec, key) in ARTIFACT_RECIPES" :key="key" class="recipe-item">
          <div class="recipe-objs">
            <span class="obj-tag">{{ ITEM_NAMES[rec.recipe[0]] || rec.recipe[0] }}</span>
            <span class="plus">+</span>
            <span class="obj-tag">{{ ITEM_NAMES[rec.recipe[1]] || rec.recipe[1] }}</span>
          </div>
          <div class="recipe-result">
            <strong>{{ rec.name }}</strong>
            <p>{{ rec.description }}</p>
            <div class="recipe-effect">{{ rec.effects.join(', ') }}</div>
          </div>
        </div>
      </div>
      <button class="btn-close-recipes" @click="showRecipes = false">✕ Cerrar</button>
    </div>

    <div v-if="store.inventory.length >= 2" class="craft-hint" @click="tryCraftInObjectArea">
      🔨 Combinar
    </div>
  </div>
</template>

<style scoped>
.btn-recipes {
  position: absolute; top: -8px; left: -8px; width: 28px; height: 28px;
  border-radius: 50%; border: 2px solid #ffd700; background: rgba(0,0,0,0.9);
  color: #ffd700; font-size: 14px; cursor: pointer; z-index: 50;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.btn-recipes:hover { transform: scale(1.2); background: rgba(255,215,0,0.3); }
.btn-recipes.open { background: rgba(255,215,0,0.3); }

.equipped-items-side {
  position: absolute; top: 50%; left: -55px; transform: translateY(-50%);
  display: flex; flex-direction: column; gap: 6px; z-index: 25;
}

.equipped-item-big {
  width: 48px; height: 48px; border-radius: 8px;
  border: 2px solid rgba(255, 215, 0, 0.9); background: rgba(0,0,0,0.95);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.6); position: relative;
  transition: all 0.2s; padding: 3px;
}

.equipped-item-big:hover {
  transform: scale(1.2); border-color: #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.7); z-index: 30;
}

.equipped-item-big:active { transform: scale(0.95); }

.equipped-item-big img {
  width: 34px; height: 34px; object-fit: contain;
  pointer-events: none; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
}

.item-effect {
  position: absolute; bottom: -22px; left: 50%; transform: translateX(-50%);
  background: rgba(0,0,0,0.95); color: #4ade80; font-size: 9px;
  padding: 2px 5px; border-radius: 3px; white-space: nowrap;
  border: 1px solid rgba(74,222,128,0.5); pointer-events: none;
  opacity: 0; transition: opacity 0.2s; z-index: 35;
}

.equipped-item-big:hover .item-effect { opacity: 1; }

.recipes-panel {
  position: absolute; top: 50px; left: -8px;
  background: rgba(15,15,20,0.98); border: 2px solid #ffd700;
  border-radius: 10px; padding: 15px; width: 280px; max-height: 400px;
  overflow-y: auto; z-index: 100; box-shadow: 0 8px 24px rgba(0,0,0,0.8);
}

.recipes-panel h4 {
  color: #ffd700; font-size: 14px; margin: 0 0 10px 0;
  text-align: center; font-family: var(--title-font);
}

.recipes-list { display: flex; flex-direction: column; gap: 8px; }

.recipe-item {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px; padding: 8px;
}

.recipe-objs {
  display: flex; align-items: center; gap: 6px; margin-bottom: 6px;
}

.obj-tag {
  background: rgba(255,215,0,0.15); border: 1px solid rgba(255,215,0,0.3);
  padding: 2px 6px; border-radius: 4px; font-size: 10px; color: #ffd700;
}

.plus { color: #888; font-size: 12px; }

.recipe-result p {
  color: #ccc; font-size: 11px; margin: 4px 0; line-height: 1.3;
}

.recipe-effect {
  color: #4ade80; font-size: 10px; font-style: italic;
}

.btn-close-recipes {
  width: 100%; margin-top: 10px; padding: 6px;
  background: rgba(255,0,0,0.2); border: 1px solid rgba(255,0,0,0.4);
  color: #ff6b6b; border-radius: 5px; cursor: pointer; font-size: 12px;
}

.btn-close-recipes:hover { background: rgba(255,0,0,0.4); }

.craft-hint {
  position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%);
  background: rgba(255, 100, 50, 0.9); color: #fff; border: none;
  padding: 4px 10px; border-radius: 12px; font-size: 10px;
  cursor: pointer; z-index: 30; white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

.craft-hint:hover { background: rgba(255, 120, 60, 1); }

.fuggler-unit {
  position: relative; width: 100%; height: 100%;
  border-radius: 4px 12px 3px 8px; background: var(--color-felt);
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; box-shadow: 4px 4px 0 rgba(0,0,0,0.8);
  border: 2px dashed #000; color: white; transition: all 0.2s;
}

.is-hex .fuggler-unit {
  border-radius: 0; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  border: none; box-shadow: none;
}

.tier-1 { background: repeating-linear-gradient(135deg, rgba(156,163,175,0.7), rgba(156,163,175,0.7) 4px, transparent 4px, transparent 8px), #374151; }
.tier-2 { background: repeating-linear-gradient(135deg, rgba(59,130,246,0.7), rgba(59,130,246,0.7) 4px, transparent 4px, transparent 8px), #1e3a8a; }
.tier-3 { background: repeating-linear-gradient(135deg, rgba(168,85,247,0.7), rgba(168,85,247,0.7) 4px, transparent 4px, transparent 8px), #581c87; }
.tier-4 { background: repeating-linear-gradient(135deg, rgba(245,158,11,0.7), rgba(245,158,11,0.7) 4px, transparent 4px, transparent 8px), #78350f; }

.fuggler-image {
  width: 65px; height: 65px; object-fit: contain;
  z-index: 1; filter: drop-shadow(2px 4px 6px black);
}

.items-legacy {
  position: absolute; top: -6px; right: -6px; display: flex; gap: 1px;
  z-index: 15; opacity: 0.4;
}

.item-icon {
  width: 12px; height: 12px; border-radius: 2px;
}
</style>
