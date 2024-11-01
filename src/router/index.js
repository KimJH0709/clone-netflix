import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import AuthPage from '../views/AuthPage.vue';

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   const isLoggedIn = localStorage.getItem('isLoggedIn');
//   if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
//     next('/signin');
//   } else {
//     next();
//   }
// });

export default router;
