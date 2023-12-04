import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Start',
      component: StartView
    },
      {
      path: '/poll/:id',
      name: 'PollView',
      component: () => import('../views/PollView.vue')
    },
    {
      path: '/create/',
      name: 'CreateView',
      component: () => import('../views/CreateView.vue')
    },
    {
      path: '/result/:id',
      name: 'ResultView',
      component: () => import('../views/ResultView.vue')
    }, 
    {
      path: '/participate/',
      name: 'ParticipateView',
      component: () => import('../views/ParticipateView.vue')
    }, 
    {
      path: '/waiting/',
      name: 'WaitingView',
      component: () => import('../views/WaitingView.vue')
    },

    {
      path: '/creatorwaiting/',
      name: 'CreatorWaitingView',
      component: () => import('../views/CreatorWaitingView.vue')
    },
    
    {
      path: '/gamecreator/',
      name: 'GameCreatorView',
      component: () => import('../views/GameCreatorView.vue')
    }

  ]
})

export default router
