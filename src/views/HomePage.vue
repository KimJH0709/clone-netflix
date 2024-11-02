<template>
  <div class="homepage">
    <header class="header">
      <h1>Netflix Clone</h1>
      <div v-if="currentUser" class="user-info">
        <p>Welcome, {{ currentUser }}!</p>
      </div>
      <button @click="handleAuthAction" class="auth-button">
        {{ currentUser ? '로그아웃' : '로그인' }}
      </button>
    </header>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      currentUser: null,
    };
  },
  methods: {
    goToSignin() {
      this.$router.push({ path: '/signin' });
    },
    handleAuthAction() {
      if (this.currentUser) {
        // 로그아웃 처리
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        alert('You have been logged out.');
        this.$router.push({ path: '/signin' });
      } else {
        // 로그인 페이지로 이동
        this.goToSignin();
      }
    },
  },
  mounted() {
    this.currentUser = localStorage.getItem('currentUser');
    if (!this.currentUser) {
      // 로그인이 되어 있지 않으면 로그인 페이지로 이동
      alert('You need to log in first.');
      this.$router.push({ path: '/signin' });
    }
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
.auth-button {
  background-color: #e50914;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}
.auth-button:hover {
  background-color: #f40612;
}
</style>
