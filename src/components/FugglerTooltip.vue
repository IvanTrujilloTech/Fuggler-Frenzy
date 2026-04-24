<script setup>
import { useGameStore } from "../stores/gameStore";
import { computed, ref } from "vue";
import { FUGGLER_TYPES } from "../data/fugglerPedia";

const store = useGameStore();
const props = defineProps({ fuggler: { type: Object, required: true } });

const reference = ref(null);
const isHovered = ref(false);
const hoverStyle = ref({ top: '0px', left: '0px' });

function onDragOver(event) { 
  // Permitir native drop SOLO si es un objeto de equipamiento
  if (event.dataTransfer.types.includes("item")) {
    event.preventDefault(); 
  }
}

function onDrop(event) {
  const itemData = event.dataTransfer.getData("item");
  if (!itemData) return; // Si no es item, dejar que vuedraggable actúe
  
  event.preventDefault();
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

const isEnemy = computed(() => {
  if (props.fuggler.side === 'enemy') return true;
  if (store.boardEnemy) {
    for (const slot of store.boardEnemy) {
      if (slot && slot.some(u => u.instanceId === props.fuggler.instanceId)) return true;
    }
  }
  return false;
});

function onMouseEnter() {
  if (isEnemy.value) return; // No mostrar en contrincantes
  isHovered.value = true;
  if (reference.value) {
    const rect = reference.value.getBoundingClientRect();
    hoverStyle.value = {
      top: `${rect.top - 15}px`,
      left: `${rect.left + rect.width / 2}px`
    };
  }
}

function onMouseLeave() {
  isHovered.value = false;
}

const computedStats = computed(() => {
  if (!props.fuggler.stats) return {};
  
  const base = { ...props.fuggler.stats };
  const modified = { ...props.fuggler.stats };
  const activeSynergies = store.activeSynergies || {};
  
  if (activeSynergies["B"]) {
    const bonus = { 3: 200, 5: 500, 6: 1000 }[store.getBreakpoint("B", activeSynergies["B"])] || 0;
    modified.hp += bonus;
  }
  if (activeSynergies["D"]) {
    const mult = { 2: 1.1, 4: 1.25, 6: 1.5 }[store.getBreakpoint("D", activeSynergies["D"])] || 1;
    modified.damage *= mult;
  }

  if (props.fuggler.items) {
    props.fuggler.items.forEach(item => {
      const desc = item.description || "";
      const dmgMatch = desc.match(/\+(\d+)% Daño de Ataque/);
      if (dmgMatch) modified.damage *= (1 + parseInt(dmgMatch[1]) / 100);
      const asMatch = desc.match(/\+(\d+)% Velocidad de Ataque/);
      if (asMatch) modified.attackSpeed *= (1 + parseInt(asMatch[1]) / 100);
      const hpMatch = desc.match(/\+(\d+) Puntos de Vida/);
      if (hpMatch) modified.hp += parseInt(hpMatch[1]);
      if (desc.includes("+1 Resistencia CC")) modified.armor = (modified.armor || 0) + 1;
      const critMatch = desc.match(/\+(\d+)% Probabilidad Crítico/);
      if (critMatch) modified.crit = (modified.crit || 0) + parseInt(critMatch[1]);
      if (desc.includes("+1s Duración CC")) modified.ccDuration = (modified.ccDuration || 0) + 1;
    });
  }

  return {
    hp: { value: Math.round(modified.hp || 0), isBuffed: modified.hp > base.hp },
    damage: { value: Math.round(modified.damage || 0), isBuffed: modified.damage > base.damage },
    attackSpeed: { value: (modified.attackSpeed || 1).toFixed(2), isBuffed: modified.attackSpeed > base.attackSpeed },
    armor: { value: modified.armor || 0, isBuffed: modified.armor > base.armor },
    crit: { value: modified.crit || 0, isBuffed: modified.crit > (base.crit || 0) }
  };
});

const synergiesList = computed(() => {
  if (!props.fuggler.types) return [];
  return props.fuggler.types.map(t => {
    const count = store.activeSynergies ? (store.activeSynergies[t] || 0) : 0;
    const typeDef = FUGGLER_TYPES[t];
    
    let level = 0;
    if (typeDef) {
       if (count >= typeDef.breakpoints[0]) {
         level = 1;
       }
       if (typeDef.breakpoints[1] && count >= typeDef.breakpoints[1]) {
         level = 2;
       }
       if (typeDef.breakpoints[2] && count >= typeDef.breakpoints[2]) {
         level = 3;
       }
    }
    
    return {
      type: t,
      name: typeDef ? typeDef.name : t,
      icon: typeDef ? typeDef.icon : null,
      color: typeDef ? typeDef.color : '#fff',
      level
    };
  });
});
</script>

<template>
  <div class="tooltip-wrapper" ref="reference" 
       @dragover="onDragOver" 
       @drop="onDrop"
       @mouseenter="onMouseEnter" 
       @mouseleave="onMouseLeave">
    
    <slot></slot> <!-- Permite a FugglerUnit renderizar su interior sin reemplazarlo -->

    <div v-if="fuggler.items && fuggler.items.length > 0" class="equipped-items-side">
      <div v-for="item in fuggler.items" :key="item.instanceId"
        class="equipped-item-big" :title="`${item.name}\n${item.description}`" @click.stop="unequipItem(item)">
        <img :src="item.img" :alt="item.name" />
        <span class="item-effect">{{ item.description }}</span>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="isHovered" class="fuggler-stats-hover" :style="hoverStyle">
        
        <!-- Fila 1: Nombre con Evolución (A, A+, A++), Tier -->
        <div class="hover-header">
          <div class="name-synergy-group">
            <span class="fuggler-name">
              {{ fuggler.name }} {{ fuggler.stars === 3 ? '(A++)' : fuggler.stars === 2 ? '(A+)' : '(A)' }}
            </span>
          </div>
          <span class="fuggler-tier">Tier {{ fuggler.tier || 1 }}</span>
        </div>

        <!-- Fila 2: Sinergias (Solo Iconos) -->
        <div class="hover-synergies" v-if="synergiesList.length > 0">
          <div v-for="syn in synergiesList" :key="syn.type" class="synergy-badge" :style="{
             '--syn-color': syn.color,
             'box-shadow': syn.level > 0 ? `0 0 ${syn.level * 6}px ${syn.color}` : 'none',
             'border-color': syn.level > 0 ? syn.color : 'rgba(255,255,255,0.2)'
          }">
            <img v-if="syn.icon" :src="syn.icon" class="syn-icon" />
          </div>
        </div>

        <hr class="separator" />

        <!-- Fila 3: Stats -->
        <div class="hover-stats-row">
          <div class="stat-col">
            <span class="stat-lbl">HP</span>
            <strong :class="{ buffed: computedStats.hp?.isBuffed }">{{ computedStats.hp?.value }}</strong>
          </div>
          <div class="stat-col">
            <span class="stat-lbl">Daño</span>
            <strong :class="{ buffed: computedStats.damage?.isBuffed }">{{ computedStats.damage?.value }}</strong>
          </div>
          <div class="stat-col">
            <span class="stat-lbl">V.Atq</span>
            <strong :class="{ buffed: computedStats.attackSpeed?.isBuffed }">{{ computedStats.attackSpeed?.value }}</strong>
          </div>
          <div class="stat-col">
            <span class="stat-lbl">Armor</span>
            <strong :class="{ buffed: computedStats.armor?.isBuffed }">{{ computedStats.armor?.value }}</strong>
          </div>
          <div class="stat-col">
            <span class="stat-lbl">Crít</span>
            <strong :class="{ buffed: computedStats.crit?.isBuffed }">{{ computedStats.crit?.value }}%</strong>
          </div>
        </div>

        <hr class="separator" />

        <!-- Fila 4: Coste -->
        <div class="hover-footer">
          <span class="gold-lbl">Precio de Venta</span>
          <span class="gold-cost">🪙 {{ fuggler.cost || 1 }}</span>
        </div>

      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.tooltip-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.equipped-items-side {
  position: absolute; top: 50%; left: -60px; transform: translateY(-50%);
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
</style>

<style>
/* Estilos globales para el Teleport */
.fuggler-stats-hover {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  position: fixed;
  transform: translate(-50%, -100%);
  background: rgba(15, 15, 20, 0.98);
  border: 2px solid #a855f7;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 10000;
  pointer-events: none;
  box-shadow: 0 10px 40px rgba(0,0,0,0.9);
  min-width: 300px;
}

.hover-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 6px;
}
.name-synergy-group {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
}
.fuggler-name {
  font-size: 20px;
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.fuggler-syn-inline {
  font-size: 16px;
  font-weight: bold;
}
.fuggler-tier {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background: #a855f7;
  padding: 3px 10px;
  border-radius: 12px;
}

.hover-synergies {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}
.synergy-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s;
}
.syn-icon {
  width: 20px;
  height: 20px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
}
.syn-label {
  font-size: 14px;
  font-weight: bold;
}

.separator {
  border: none;
  border-top: 1px solid rgba(255,255,255,0.15);
  margin: 2px 0;
}

.hover-stats-row {
  display: flex;
  justify-content: space-between;
  background: rgba(0,0,0,0.4);
  padding: 12px;
  border-radius: 8px;
  gap: 14px;
}
.stat-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.stat-lbl {
  font-size: 13px;
  color: #a855f7;
  text-transform: uppercase;
  font-weight: bold;
}
.stat-col strong {
  font-size: 18px;
  color: #fff;
}
.stat-col strong.buffed {
  color: #10b981;
}

.hover-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 4px;
  font-size: 16px;
  font-weight: bold;
}
.gold-lbl {
  color: #9ca3af;
}
.gold-cost {
  color: #fbbf24;
}
</style>
