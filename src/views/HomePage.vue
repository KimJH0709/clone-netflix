<!-- src/views/HomePage.vue -->
<template>
    <div class="homepage">
      <header class="header">
        <h1>Netflix Clone</h1>
        <button @click="goToSignin" class="signin-button">로그인</button>
      </header>
    </div>
  </template>

<script>
export default {
  name: 'HomePage',
  methods: {
    goToSignin() {
      this.$router.push({ path: '/signin' });
    },
  },
};
</script>

  <style scoped>
  .homepage {
    padding: 20px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #141414;
    color: #fff;
    padding: 10px;
  }
  .signin-button {
    background-color: #e50914;
    color: #fff;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
  }
  .signin-button:hover {
    background-color: #f40612;
  }
  </style>
