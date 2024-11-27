import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import AuthPage from '../views/AuthPage.vue';
import WishlistPage from '../views/WishlistPage.vue';
import PopularPage from '../views/PopularPage.vue';
import SearchPage from '../views/SearchPage.vue';

const routes = [
  {
    path: '/signin',
    name: 'Auth',
    component: AuthPage,
  },
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: WishlistPage,
  },
  {
    path: '/popular',
    name: 'Popular',
    component: PopularPage,
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchPage,
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/signin',
  },
];

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/clone-netflix/' : '/'),
  routes,
});

export default router;
