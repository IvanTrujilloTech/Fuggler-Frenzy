import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import GameView from '../views/GameView.vue'
import PediaView from '../views/PediaView.vue'
import LobbyView from '../views/LobbyView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: LobbyView
    },
    {
      path: '/game',
      name: 'game',
      component: GameView
    },
    {
      path: '/pedia',
      name: 'pedia',
      component: PediaView
    }
  ]
})

export default router
