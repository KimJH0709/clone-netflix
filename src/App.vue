<!-- src/App.vue -->
<template>
  <div id="app">
    <NavBar v-if="!isLoginPage"/>
    <router-view />
  </div>
</template>

<script>
// import { useRoute } from 'vue-router';
import NavBar from './components/Nabvar.vue';

export default {
  components: {
    NavBar,
  },
  computed: {
    isLoginPage() {
      const route = this.$route;
      return route.path === '/signin' || route.path === '/signup';
    },
  },
  name: 'App',
};
</script>
