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
      path: '/participantwaiting/:id/:name',
      name: 'ParticipantWaitingView',
      component: () => import('../views/ParticipantWaitingView.vue')
    },

    {
      path: '/creatorwaiting/:id',
      name: 'CreatorWaitingView',
      component: () => import('../views/CreatorWaitingView.vue')
    },
    
    {
      path: '/creatorgame/:id',
      name: 'CreatorGameView',
      component: () => import('../views/CreatorGameView.vue')
    },

    {
      path: '/participantgame/:id/:name',
      name: 'ParticipantGameView',
      component: () => import('../views/ParticipantGameView.vue')
    },
    {
      path: '/participantlivescore/:id/:name',
      name: 'ParticipantLiveScoreView',
      component: () => import('../views/ParticipantLiveScoreView.vue')
    },


    {
      path: '/creatorleaderboard/:id',
      name: 'CreatorLeaderboardView',
      component: () => import('../views/CreatorLeaderboardView.vue')
    },

    
    {
      path: '/participantleaderboard/:id/:name',
      name: 'ParticipantLeaderBoardView',
      component: () => import('../views/ParticipantLeaderBoardView.vue')
    },
    
        {
      path: '/result/:id',
      name: 'ResultView',
      component: () => import('../views/ResultView.vue')
    }
  
  ]
})

export default router