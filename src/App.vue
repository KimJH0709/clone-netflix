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

<style scoped>
#app {
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  width: 100%;
  height: auto;
  background-color: #000;
}
</style>
