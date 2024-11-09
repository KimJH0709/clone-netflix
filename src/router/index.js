import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import AuthPage from '../views/AuthPage.vue';
import WishlistPage from '../views/WishlistPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/signin',
    name: 'Auth',
    component: AuthPage,
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: WishlistPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
