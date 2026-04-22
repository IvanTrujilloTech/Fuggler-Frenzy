<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { FUGGLERS, FUGGLER_TYPES } from '../data/fugglerPedia'
import { ITEM_COMPONENTS, ARTIFACT_RECIPES } from '../data/items'
import FugglerUnit from '../components/FugglerUnit.vue'
import ItemTooltip from '../components/ItemTooltip.vue'
import iconDientudos from '../assets/HUD/SINERGYS/DIENTUDOS.svg'
import iconBotones from '../assets/HUD/SINERGYS/BOTONES.svg'
import iconRadioactivos from '../assets/HUD/SINERGYS/RADIOACTIVOS.svg'
import iconInadaptados from '../assets/HUD/SINERGYS/INADAPTADOS.svg'
import iconCazadores from '../assets/HUD/SINERGYS/CAZADORES.svg'
import iconCoin from '../assets/HUD/OBJECTS/COIN.svg'

const SYNERGY_ICONS = {
  D: iconDientudos,
  B: iconBotones,
  R: iconRadioactivos,
  I: iconInadaptados,
  C: iconCazadores,
}

const router = useRouter()
const activeTab = ref('fugglers')

// agrupa los fugglers por tipo
const fugglersByType = computed(() => {
  const groups = {}
  Object.keys(FUGGLER_TYPES).forEach(typeKey => {
    groups[typeKey] = []
  })
  
  FUGGLERS.forEach(fuggler => {
    fuggler.types.forEach(typeKey => {
      if (groups[typeKey]) {
        groups[typeKey].push(fuggler)
      }
    })
  })
  
  return groups
})
</script>

<template>
  <div class="pedia-container">
    <div class="header">
      <button class="back-btn" @click="router.push('/')">← Volver</button>
      <h1 class="title">FugglerPedia</h1>
    </div>

    <div class="pedia-card">
      <div class="tabs">
        <button 
          :class="['tab-btn', { active: activeTab === 'fugglers' }]" 
          @click="activeTab = 'fugglers'"
        >
          Fugglers
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'items' }]" 
          @click="activeTab = 'items'"
        >
          Objetos
        </button>
      </div>

      <div class="content-area">
        <!-- pestana de fugglers -->
        <div v-if="activeTab === 'fugglers'" class="scroll-area flex-col">
          <div v-for="(fList, typeKey) in fugglersByType" :key="typeKey" class="type-section">
            <h2 class="type-title" :style="{ backgroundColor: FUGGLER_TYPES[typeKey].color, color: typeKey === 'R' ? '#000' : '#fff' }">
              <img :src="SYNERGY_ICONS[typeKey]" class="synergy-icon" :alt="FUGGLER_TYPES[typeKey].name" />
              {{ FUGGLER_TYPES[typeKey].name }}
            </h2>
            <div class="fuggler-grid">
              <div class="fuggler-slot is-hex" v-for="fuggler in fList" :key="fuggler.id + '-' + typeKey">
                <FugglerUnit :fuggler="fuggler" :minimal="true" />
              </div>
            </div>
          </div>
        </div>

        <!-- pestana de objetos -->
        <div v-if="activeTab === 'items'" class="scroll-area flex-col">
          <div class="type-section">
            <h2 class="type-title" style="background-color: #555;">Componentes Básicos</h2>
            <div class="items-grid">
              <ItemTooltip v-for="item in ITEM_COMPONENTS" :key="item.id" :item="item">
                <div class="item-card">
                  <img :src="item.img" class="item-icon" :alt="item.name" />
                  <div class="item-info">
                    <h3>{{ item.name }}</h3>
                    <p>{{ item.description }}</p>
                  </div>
                </div>
              </ItemTooltip>
            </div>
          </div>

          <div class="type-section artifacts-section">
            <h2 class="type-title" style="background-color: #ffd700; color: #000;">Artefactos Combinados</h2>
            <div class="items-grid">
              <ItemTooltip v-for="item in ARTIFACT_RECIPES" :key="item.id" :item="item">
                <div class="item-card artifact">
                  <img :src="item.img" class="item-icon" :alt="item.name" />
                  <div class="item-info">
                    <h3 style="color: #ffd700">{{ item.name }}</h3>
                    <p>{{ item.description }}</p>
                  </div>
                </div>
              </ItemTooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pedia-container {
  height: 100vh;
  width: 100vw;
  background: repeating-linear-gradient(135deg, #0f0f13, #0f0f13 20px, #1a1a24 20px, #1a1a24 40px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
}

.header {
  width: 100%;
  max-width: 1000px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.back-btn {
  background: var(--color-blood);
  color: white;
  border: 3px solid #000;
  padding: 10px 20px;
  font-family: var(--title-font);
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 4px 4px 0px #000;
  transition: transform 0.1s;
}

.back-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #000;
}

.title {
  font-family: var(--title-font);
  font-size: 3rem;
  color: var(--color-toxic);
  text-shadow: 3px 3px 0 #000;
  margin: 0 auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.pedia-card {
  width: 100%;
  max-width: 1000px;
  flex-grow: 1;
  background: #2a251f;
  border: 4px dashed var(--color-stitch);
  border-radius: 10px;
  box-shadow: 10px 10px 0px rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tabs {
  display: flex;
  background: #1a1714;
  border-bottom: 4px solid #000;
}

.tab-btn {
  flex: 1;
  padding: 15px;
  background: transparent;
  color: #888;
  border: none;
  border-right: 4px solid #000;
  font-family: var(--title-font);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:last-child {
  border-right: none;
}

.tab-btn:hover {
  background: #222;
  color: #fff;
}

.tab-btn.active {
  background: var(--color-toxic);
  color: #000;
}

.content-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.scroll-area {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
}

.type-section {
  background: rgba(0,0,0,0.3);
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #000;
  margin-bottom: 30px;
}

.type-title {
  font-family: var(--title-font);
  display: inline-block;
  padding: 5px 15px;
  color: #fff;
  border: 2px solid #000;
  box-shadow: 4px 4px 0 #000;
  transform: rotate(-1deg);
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.fuggler-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.fuggler-slot {
  width: 80px;
  height: 92px;
  position: relative;
}

.is-hex {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  transition: transform 0.2s;
}

.is-hex:hover {
  transform: scale(1.1);
  z-index: 10;
}

/* cuadricula de objetos */
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}

.item-card {
  background: #333;
  border: 3px solid #000;
  border-radius: 8px;
  box-shadow: 4px 4px 0 #000;
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 15px;
  transition: transform 0.1s;
}

.item-card:hover {
  transform: translateY(-5px);
}

.artifact {
  background: #2d1a36;
  border-color: #ffd700;
}

.item-icon {
  width: 60px;
  height: 60px;
  object-fit: contain;
  background: #111;
  padding: 5px;
  border-radius: 8px;
  border: 2px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.synergy-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  vertical-align: middle;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.8));
}

.coin-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
  vertical-align: middle;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.6));
}

.item-info h3 {
  font-family: var(--title-font);
  color: var(--color-toxic);
  margin: 0 0 5px 0;
  font-size: 1.2rem;
}

.item-info p {
  color: #ccc;
  margin: 0;
  font-size: 0.9rem;
}

.flex-col {
  display: flex;
  flex-direction: column;
}
</style>