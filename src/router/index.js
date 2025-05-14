import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Register from '../components/Register.vue'
import SignIn from '../components/SignIn.vue'
import screen2 from '../components/screen2.vue'
import Favorites from '@/components/Favorites.vue';
import Leaflet from '@/components/leaflet.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/register', component: Register },
  { path: '/signin', component: SignIn },
  { path: '/planner', component: screen2 },
  { path: '/favorites', component: Favorites },
  { path: '/leaflet/:routeTitle?', component: Leaflet, name: 'Leaflet' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
