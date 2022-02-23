import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Forum from '../views/Forum.vue';
import SignUp from '../views/SignUp.vue';
import Login from '../views/Login.vue';
import AdminBoard from '../views/AdminBoard.vue';
import ModeratorBoard from '../views/ModeratorBoard.vue';
import Profil from '../views/Profil.vue';
import PageNotFound from '../components/PageNotFound.vue';

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
  {
    path: '/admin-board',
    name: 'AdminBoard',
    component: AdminBoard
  },
  {
    path: '/moderator-board',
    name: 'ModeratorBoard',
    component: ModeratorBoard
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: PageNotFound,
    meta: {
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
