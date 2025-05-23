import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import screen2 from '../components/planner.vue'
import Favorites from '@/components/Favorites.vue';
import Leaflet from '@/components/leaflet.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/planner', component: screen2, name: 'planner' },
  { path: '/favorites', component: Favorites },
  { path: '/leaflet/:routeTitle?', component: Leaflet, name: 'Leaflet' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
