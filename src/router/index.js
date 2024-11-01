import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import SignInPage from '../views/Signin.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignInPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
