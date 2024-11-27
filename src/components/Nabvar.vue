<template>
  <div>
    <nav class="navbar">
      <div class="navbar-brand">
        <a href="/" class="navbar-logo">MyApp</a>
      </div>
      <ul class="navbar-links">
        <li><router-link to="/">홈</router-link></li>
        <li><router-link to="/popular">대세 컨텐츠</router-link></li>
        <li><router-link to="/search">찾아보기</router-link></li>
        <li><router-link to="/wishlist">내가 찜한 리스트</router-link></li>
      </ul>
      <button v-if="currentUser" @click="logout" class="auth-button">로그아웃</button>
    </nav>
    <div class="content">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      currentUser: null,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('currentUser');
      this.currentUser = null;
      alert('You have been logged out.');
      this.$router.push({ path: '/signin' });
    },
  },
  mounted() {
    this.currentUser = localStorage.getItem('currentUser');
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #333;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  height: 60px;
}

.navbar-brand a {
  text-decoration: none;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-links {
  list-style: none;
  display: flex;
  gap: 20px;
}

.navbar-links li {
  display: inline;
}

.navbar-links a {
  text-decoration: none;
  color: white;
  font-size: 1rem;
}

.navbar-links a:hover {
  color: #ddd;
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

.content {
  padding-top: 60px;
}
</style>
