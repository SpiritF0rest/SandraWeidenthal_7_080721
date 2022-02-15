import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Forum from '../views/Forum.vue';
import SignUp from '../views/SignUp.vue';
import Login from '../views/Login.vue';
import Profil from '../views/Profil.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/forum',
    name: 'Forum',
    component: Forum
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/profil',
    name: 'Profil',
    component: Profil
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
