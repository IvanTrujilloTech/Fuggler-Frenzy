import { defineStore } from 'pinia'
import lobbyMusic from '../assets/music/lobby_background.mp3'
import combatMusic from '../assets/music/combat_music.mp3'

// Import death sounds
import death1 from '../assets/sound_effects/death_1.mp3'
import death2 from '../assets/sound_effects/death_2.mp3'
import death3 from '../assets/sound_effects/death_3.mp3'
import death4 from '../assets/sound_effects/death_4.mp3'
import death5 from '../assets/sound_effects/death_5.mp3'
import death6 from '../assets/sound_effects/death_6.mp3'
import death7 from '../assets/sound_effects/death_7.mp3'
import death8 from '../assets/sound_effects/death_8.mp3'

const deathSounds = [death1, death2, death3, death4, death5, death6, death7, death8]

export const useAudioStore = defineStore('audio', {
  state: () => ({
    musicVolume: 0.4,
    sfxVolume: 0.6,
    isMuted: false,
    musicAudio: null,
    currentMusicPath: null,
    hasInteracted: false, // To handle browser autoplay policies
  }),
  actions: {
    init() {
      // Initialize music object but don't play yet
      if (!this.musicAudio) {
        this.musicAudio = new Audio(lobbyMusic)
        this.musicAudio.loop = true
        this.updateVolumes()

        // Handle browser autoplay policy: play on first interaction
        const startOnInteraction = () => {
          if (this.currentMusicPath === 'lobby' && this.musicAudio.paused) {
            this.musicAudio.play().catch(() => {})
          }
          document.removeEventListener('click', startOnInteraction)
          document.removeEventListener('keydown', startOnInteraction)
        }
        document.addEventListener('click', startOnInteraction)
        document.addEventListener('keydown', startOnInteraction)
      }
    },
    playLobbyMusic() {
      this.init()
      if (this.currentMusicPath === 'lobby') return
      
      this.musicAudio.src = lobbyMusic
      this.currentMusicPath = 'lobby'
      this.musicAudio.play().catch(err => {
        console.warn("Autoplay blocked. Waiting for user interaction.", err)
      })
    },
    playCombatMusic() {
      this.init()
      if (this.currentMusicPath === 'combat') return
      
      this.musicAudio.src = combatMusic
      this.currentMusicPath = 'combat'
      this.musicAudio.play().catch(err => {
        console.warn("Autoplay blocked. Waiting for user interaction.", err)
      })
    },
    updateVolumes() {
      if (this.musicAudio) {
        this.musicAudio.volume = this.isMuted ? 0 : this.musicVolume
      }
    },
    playSFX(path) {
      if (this.isMuted) return
      const sfx = new Audio(path)
      sfx.volume = this.sfxVolume
      sfx.play().catch(e => console.warn("SFX play failed:", e))
    },
    playRandomDeathSound() {
      const randomIndex = Math.floor(Math.random() * deathSounds.length)
      this.playSFX(deathSounds[randomIndex])
    },
    setMusicVolume(vol) {
      this.musicVolume = vol
      this.updateVolumes()
    },
    setSfxVolume(vol) {
      this.sfxVolume = vol
    },
    toggleMute() {
      this.isMuted = !this.isMuted
      this.updateVolumes()
    },
    stopMusic() {
      if (this.musicAudio) {
        this.musicAudio.pause()
        this.currentMusicPath = null
      }
    }
  }
})
