<script setup>
import { useGameStore } from "../stores/gameStore";
import iconCoin from "../assets/HUD/OBJECTS/COIN.svg";
import iconDientudos from "../assets/HUD/SINERGYS/DIENTUDOS.svg";
import iconBotones from "../assets/HUD/SINERGYS/BOTONES.svg";
import iconRadioactivos from "../assets/HUD/SINERGYS/RADIOACTIVOS.svg";
import iconInadaptados from "../assets/HUD/SINERGYS/INADAPTADOS.svg";
import iconCazadores from "../assets/HUD/SINERGYS/CAZADORES.svg";
import FugglerTooltip from './FugglerTooltip.vue'

const SYNERGY_ICONS = {
  D: iconDientudos,
  B: iconBotones,
  R: iconRadioactivos,
  I: iconInadaptados,
  C: iconCazadores,
};

const store = useGameStore();
</script>

<template>
  <div class="shop-container">
    <div class="shop-info">
      <h3>
        Tienda
        <img :src="iconCoin" class="coin-icon-shop" alt="Oro" />
        {{ store.gold }}
      </h3>
      <button
        class="btn-reroll"
        @click="store.rollShop(false)"
        :disabled="store.gold < 2"
      >
        Reroll (2 <img :src="iconCoin" class="coin-icon-shop" alt="Oro" />)
      </button>
    </div>
    <div class="shop-cards">
      <div
        v-for="(fuggler, index) in store.shop"
        :key="index"
        class="shop-card-wrapper"
      >
        <div v-if="!fuggler" class="shop-card empty"></div>
        <FugglerTooltip v-else :fuggler="fuggler">
          <div 
            class="shop-card"
            :class="[fuggler.types[0]]"
            @click="store.buyUnit(index)"
          >
            <div class="card-content">
              <div class="cost">
                {{ fuggler.cost }}
                <img :src="iconCoin" class="coin-icon-cost" alt="Oro" />
              </div>
              <img
            v-if="fuggler.image"
            :src="fuggler.image"
            :alt="fuggler.name"
            class="shop-fuggler-image"
          />
              <div class="name">{{ fuggler.name }}</div>
              <div class="types">
                <img
                  v-for="typeKey in fuggler.types"
                  :key="typeKey"
                  :src="SYNERGY_ICONS[typeKey]"
                  class="type-icon-shop"
                  :alt="typeKey"
                />
              </div>
            </div>
          </div>
        </FugglerTooltip>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-container {
  background: repeating-linear-gradient(
    135deg,
    var(--color-felt),
    var(--color-felt) 10px,
    #222 10px,
    #222 20px
  );
  border-top: 6px dashed var(--color-stitch);
  border-right: 6px dashed var(--color-stitch);
  border-left: 6px dashed var(--color-stitch);
  padding: 10px 40px;
  display: flex;
  flex-direction: column;
  box-shadow: inset 0 10px 20px rgba(0, 0, 0, 0.8);
  position: relative;
  overflow-y: hidden; /* Permitir scroll vertical si el wrap es mucho */
  min-height: 70px;
  width: 100%;
  max-width: 1670px;
  margin: 0 auto;
}
h3 {
  text-align: center;
}
@media (max-width: 600px) {
  .shop-container {
    padding-bottom: 2rem;
  }
}
@media (max-width: 1366px) {
  .shop-info {
    padding: 0 10px;
  }
  button{
        height: 54px;
        width: 200px;  }
        h3{
          font-size: 1.2rem;
        }
  .shop-cards {
    margin-top: -34px;
  }
}

/* zona de venta */
.sell-zone-wrapper {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(3px);
}
.sell-zone {
  width: 85%;
  height: 80px;
  border: 4px dashed var(--color-blood, #e63946);
  border-radius: 6px 20px 5px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, background 0.2s, transform 0.15s;
  animation: sell-pulse 1.2s ease-in-out infinite;
  background: rgba(230, 57, 70, 0.08);
  box-shadow: 0 0 20px rgba(230, 57, 70, 0.3);
  cursor: default;
}
.sell-zone--over {
  border-color: #ff6b6b;
  background: rgba(230, 57, 70, 0.25);
  transform: scale(1.04);
  box-shadow: 0 0 40px rgba(255, 107, 107, 0.7);
  animation: none;
}
@keyframes sell-pulse {
  0%,
  100% {
    box-shadow: 0 0 14px rgba(230, 57, 70, 0.3);
  }
  50% {
    box-shadow: 0 0 32px rgba(230, 57, 70, 0.7);
  }
}
.sell-zone-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  pointer-events: none;
  user-select: none;
}
.sell-icon {
  font-size: 1.8rem;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.7));
}
.sell-label {
  font-family: var(--title-font);
  font-size: 1.2rem;
  letter-spacing: 2px;
  color: #ff6b6b;
  text-shadow: 2px 2px 0 #000;
  text-transform: uppercase;
}

/* transicion de desvanecimiento de la zona de venta */
.sell-fade-enter-active,
.sell-fade-leave-active {
  transition: opacity 0.2s ease;
}
.sell-fade-enter-from,
.sell-fade-leave-to {
  opacity: 0;
}

.shop-info {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-family: var(--title-font);
  font-size: 1.5rem;
  gap: 80%;
    flex-wrap: nowrap;        

  letter-spacing: 2px;
  color: #fff;
}
.shop-info h3 {
  white-space: nowrap;      
  text-overflow: ellipsis;
  width:350px;
}
@media (min-resolution: 0.8dppx) and (max-resolution: 1.2dppx) {
  .shop-card {
    width: 170px;
    height: 210px;
  }

  .shop-fuggler-image {
    width: 90px;
    height: 90px;
  }

  .name {
    font-size: 1.2rem;
  }

  .shop-cards {
    gap: 2.5rem;
  }
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
   flex-shrink: 0;  
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
  margin-top: -10px;
  justify-content: center;
  flex-wrap: wrap;
}
@media (max-width: 1280px) {
  .shop-container {
    padding: 10px 20px;
  }

  /* HEADER más compacto */
  .shop-info {
    font-size: 1.1rem;
  }

  .btn-reroll {
    font-size: 0.95rem;
    padding: 0.3rem 0.7rem;
  }

  .coin-icon-shop {
    width: 16px;
    height: 16px;
  }

  /* SELL PANEL más pequeño */
  .sell-zone {
    height: 55px;
    width: 65%;
  }

  .sell-label {
    font-size: 0.8rem;
  }

  .sell-icon {
    font-size: 1.1rem;
  }

  /* CARTAS más pequeñas para que quepan */
  .shop-card {
    width: 110px;
    height: 150px;
  }

  .shop-fuggler-image {
    width: 55px;
    height: 55px;
  }

  .name {
    font-size: 0.85rem;
  }

  .cost {
    min-width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }
}
@media (max-width: 600px) {
  .shop-cards {
    gap: 0.5rem;
  }
}
.shop-card {
  width: 140px;
  height: 180px;

  background: #333;
  border-radius: 5px 15px 4px 10px;
  border: 4px solid #000;
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 1);
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

/* Fondos por Tier (Raridad) sincronizados con FugglerUnit.vue */
.tier-1 { background: repeating-linear-gradient(135deg, rgba(156,163,175,0.7), rgba(156,163,175,0.7) 4px, transparent 4px, transparent 8px), #374151; }
.tier-2 { background: repeating-linear-gradient(135deg, rgba(59,130,246,0.7), rgba(59,130,246,0.7) 4px, transparent 4px, transparent 8px), #1e3a8a; }
.tier-3 { background: repeating-linear-gradient(135deg, rgba(168,85,247,0.7), rgba(168,85,247,0.7) 4px, transparent 4px, transparent 8px), #581c87; }
.tier-4 { background: repeating-linear-gradient(135deg, rgba(245,158,11,0.7), rgba(245,158,11,0.7) 4px, transparent 4px, transparent 8px), #78350f; }

@media (max-width: 600px) {
  .shop-card {
    width: 90px;
    height: 120px;
    border-width: 2px;
  }
}

@media (max-width: 450px) {
  .shop-card {
    width: 70px;
    height: 100px;
  }
  .shop-cards {
    gap: 0.2rem;
  }
}
.shop-card.empty {
  background: rgba(0, 0, 0, 0.3);
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
  min-width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-family: var(--number-font);
  font-size: 1rem;
  box-shadow: 3px 3px 0 var(--color-toxic);
  transform: rotate(5deg);
  padding: 0 4px;
  box-sizing: border-box;
}
.coin-icon-shop {
  width: 20px;
  height: 20px;
  object-fit: contain;
  vertical-align: middle;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}
.coin-icon-cost {
  width: 16px;
  height: 16px;
  object-fit: contain;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.5));
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

@media (max-width: 600px) {
  .name {
    font-size: 0.8rem;
    margin-top: 5px;
  }
  .shop-fuggler-image {
    width: 45px;
    height: 45px;
    margin-top: 5px;
  }
  .cost {
    min-width: 25px;
    height: 25px;
    font-size: 0.8rem;
    top: -5px;
    right: -5px;
  }
  .shop-info {
    font-size: 1.1rem;
  }
  .btn-reroll {
    font-size: 1rem;
    padding: 0.3rem 0.8rem;
  }
}
.types {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px 6px;
  background: rgba(0, 0, 0, 0.5);
  border-top: 2px solid #000;
}
.type-icon-shop {
  width: 22px;
  height: 22px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.7));
}
</style>
