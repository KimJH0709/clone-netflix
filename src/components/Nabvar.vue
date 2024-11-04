<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <a href="/" class="navbar-logo">MyApp</a>
    </div>
    <ul class="navbar-links">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/about">About</router-link></li>
      <li><router-link to="/contact">Contact</router-link></li>
      <li><router-link to="/profile">Profile</router-link></li>
    </ul>
    <button v-if="currentUser" @click="logout" class="auth-button">로그아웃</button>
  </nav>
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
</style>
