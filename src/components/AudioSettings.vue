<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAudioStore } from '../stores/audioStore'

const audioStore = useAudioStore()
const isOpen = ref(false)
const settingsRef = ref(null)

const toggleSettings = () => {
  isOpen.value = !isOpen.value
}

const handleClickOutside = (event) => {
  if (settingsRef.value && !settingsRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div class="audio-settings-container" ref="settingsRef">
    <!-- Settings Panel -->
    <Transition name="slide-fade">
      <div v-if="isOpen" class="settings-panel">
        <h3 class="panel-title">AJUSTES DE AUDIO</h3>
        
        <div class="setting-item">
          <div class="label-row">
            <span>Música</span>
            <span>{{ Math.round(audioStore.musicVolume * 100) }}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            v-model.number="audioStore.musicVolume" 
            @input="audioStore.setMusicVolume(audioStore.musicVolume)"
            class="volume-slider"
          />
        </div>

        <div class="setting-item">
          <div class="label-row">
            <span>Efectos</span>
            <span>{{ Math.round(audioStore.sfxVolume * 100) }}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            v-model.number="audioStore.sfxVolume" 
            @input="audioStore.setSfxVolume(audioStore.sfxVolume)"
            class="volume-slider"
          />
        </div>

        <button class="mute-btn" @click="audioStore.toggleMute" :class="{ 'is-muted': audioStore.isMuted }">
          {{ audioStore.isMuted ? 'HABLAME' : 'CALLADITO' }}
        </button>
      </div>
    </Transition>

    <!-- Gear Button -->
    <button class="gear-btn" @click="toggleSettings" :class="{ 'active': isOpen }">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="gear-icon">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.audio-settings-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.gear-btn {
  width: 50px;
  height: 50px;
  background: var(--color-felt, #374151);
  border: 3px solid #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 4px 4px 0 #000;
  color: #fff;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.gear-btn:hover {
  transform: scale(1.1) rotate(45deg);
  background: var(--color-toxic, #a855f7);
  color: #000;
}

.gear-btn.active {
  transform: rotate(90deg);
  background: var(--color-blood, #ef4444);
}

.gear-icon {
  width: 30px;
  height: 30px;
}

.settings-panel {
  background: #1a1a1e;
  border: 4px solid #000;
  border-radius: 12px 2px 12px 2px;
  padding: 20px;
  width: 250px;
  box-shadow: 10px 10px 0 rgba(0,0,0,0.5);
  margin-bottom: 5px;
}

.panel-title {
  margin: 0 0 15px 0;
  font-family: var(--title-font, sans-serif);
  color: var(--color-toxic, #a855f7);
  font-size: 1.2rem;
  text-align: center;
  letter-spacing: 2px;
  text-shadow: 2px 2px 0 #000;
}

.setting-item {
  margin-bottom: 15px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  color: #fff;
  font-family: var(--number-font, sans-serif);
  font-size: 0.9rem;
}

.volume-slider {
  width: 100%;
  appearance: none;
  background: #333;
  height: 8px;
  border-radius: 4px;
  outline: none;
  border: 2px solid #000;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--color-toxic, #a855f7);
  border: 2px solid #000;
  cursor: pointer;
  border-radius: 2px;
}

.mute-btn {
  width: 100%;
  padding: 8px;
  background: #333;
  color: #fff;
  border: 2px solid #000;
  font-family: var(--title-font, sans-serif);
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
  margin-top: 10px;
}

.mute-btn:hover {
  background: #444;
}

.mute-btn.is-muted {
  background: var(--color-blood, #ef4444);
  color: #fff;
}

/* Animations */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
