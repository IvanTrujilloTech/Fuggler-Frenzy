<script setup>
import { computed } from 'vue'
import { useMultiplayerStore } from '../stores/multiplayerStore'

const multiStore = useMultiplayerStore()

const sortedPlayers = computed(() => {
  return Object.values(multiStore.players).sort((a, b) => b.hp - a.hp)
})
</script>

<template>
  <div class="ranking-container">
    <div class="ranking-scroll">
      <div 
        v-for="(player, idx) in sortedPlayers" 
        :key="idx" 
        class="ranking-card"
        :class="{ 'is-me': player.username === multiStore.players[multiStore.playerKey]?.username }"
      >
        <div class="rank-pos">#{{ idx + 1 }}</div>
        <div class="player-info">
          <div class="username">{{ player.username }}</div>
          <div class="hp-line">
            <div class="hp-bar">
              <div class="hp-fill" :style="{ width: player.hp + '%' }"></div>
            </div>
            <span class="hp-val">{{ player.hp }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ranking-container {
  width: 100%;
  background: var(--color-felt);
  border-bottom: 4px dashed var(--color-stitch);
  padding: 10px;
  overflow: hidden;
  z-index: 5;
}

.ranking-scroll {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding-bottom: 5px;
  justify-content: center;
}

.ranking-card {
  flex: 0 0 200px;
  background: #222;
  border: 3px solid #000;
  border-radius: 8px 15px 4px 12px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 4px 4px 0 rgba(0,0,0,1);
  transform: rotate(1deg);
  transition: all 0.3s ease;
}

.ranking-card.is-me {
  border-color: var(--color-toxic);
  transform: scale(1.05) rotate(-1deg);
  background: #1a1a1a;
  box-shadow: 0 0 15px var(--color-toxic), 4px 4px 0 #000;
}

.rank-pos {
  font-family: var(--title-font);
  font-size: 1.2rem;
  color: var(--color-toxic);
  min-width: 30px;
}

.player-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.username {
  font-family: var(--title-font);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hp-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hp-bar {
  flex-grow: 1;
  height: 8px;
  background: #444;
  border-radius: 4px;
  border: 1px solid #000;
  overflow: hidden;
}

.hp-fill {
  height: 100%;
  background: var(--color-toxic);
  transition: width 0.5s ease;
}

.hp-val {
  font-family: var(--number-font);
  font-size: 0.8rem;
  color: #fff;
}

/* Scrollbar */
.ranking-scroll::-webkit-scrollbar {
  height: 4px;
}
.ranking-scroll::-webkit-scrollbar-thumb {
  background: var(--color-stitch);
  border-radius: 2px;
}
</style>
