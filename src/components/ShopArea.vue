<script setup>
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()
</script>

<template>
  <div class="shop-container">
    <div class="shop-info">
      <h3>Tienda (Oro: {{ store.gold }})</h3>
      <button class="btn-reroll" @click="store.rollShop(false)" :disabled="store.gold < 2">
        Reroll (2G)
      </button>
    </div>
    <div class="shop-cards">
      <div 
        v-for="(fuggler, index) in store.shop" 
        :key="index"
        class="shop-card"
        :class="{ empty: !fuggler, [fuggler?.types[0]]: true }"
        @click="store.buyUnit(index)"
      >
        <div v-if="fuggler" class="card-content">
          <div class="cost">{{ fuggler.cost }}G</div>
          <img v-if="fuggler.image" :src="fuggler.image" :alt="fuggler.name" class="shop-fuggler-image" />
          <div class="name">{{ fuggler.name }}</div>
          <div class="types">{{ fuggler.types.join(' | ') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-container {
  background: repeating-linear-gradient(135deg, var(--color-felt), var(--color-felt) 10px, #222 10px, #222 20px);
  border-top: 6px dashed var(--color-stitch);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: inset 0 10px 20px rgba(0,0,0,0.8);
}
.shop-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--title-font);
  font-size: 1.5rem;
  letter-spacing: 2px;
  color: #fff;
}
.btn-reroll {
  background: var(--color-toxic);
  color: #000;
  border: 4px solid #000;
  padding: 0.5rem 1.5rem;
  border-radius: 4px 10px 3px 12px;
  cursor: pointer;
  font-family: var(--title-font);
  font-size: 1.5rem;
  box-shadow: 4px 4px 0 #000;
  transform: rotate(-2deg);
  transition: transform 0.1s;
}
.btn-reroll:not(:disabled):hover {
  transform: scale(1.05) rotate(1deg);
  background: #cbf066;
}
.btn-reroll:disabled {
  background: #555;
  color: #222;
  box-shadow: none;
  cursor: not-allowed;
}
.shop-cards {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}
.shop-card {
  width: 140px;
  height: 180px;
  background: #333;
  border-radius: 5px 15px 4px 10px;
  border: 4px solid #000;
  box-shadow: 8px 8px 0 rgba(0,0,0,1);
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  transition: transform 0.1s;
  transform: rotate(1deg);
}
.shop-card:nth-child(even) {
  transform: rotate(-2deg);
}
.shop-card:not(.empty):hover {
  transform: scale(1.05) translateY(-10px) rotate(3deg);
  box-shadow: 12px 12px 0 var(--color-toxic);
}
.shop-card.empty {
  background: rgba(0,0,0,0.3);
  border: 4px dashed var(--color-stitch);
  box-shadow: none;
  cursor: default;
}
.card-content {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
}
.cost {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #000;
  color: var(--color-toxic);
  border: 3px solid #000;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--number-font);
  font-size: 1rem;
  box-shadow: 3px 3px 0 var(--color-toxic);
  transform: rotate(5deg);
}
.shop-fuggler-image {
  width: 75px;
  height: 75px;
  object-fit: contain;
  margin-top: 10px;
  filter: drop-shadow(2px 4px 6px black);
}
.name {
  margin-top: 10px;
  font-family: var(--title-font);
  font-size: 1.1rem;
  letter-spacing: 1px;
}
.types {
  margin-top: auto;
  font-size: 1rem;
  color: #fff;
  background: var(--color-blood);
  padding: 2px 8px;
  border: 2px solid #000;
  transform: rotate(-3deg);
}
</style>
