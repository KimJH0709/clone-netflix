<template>
  <div>
    <nav class="navbar">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-logo">NETFLIX</router-link>
      </div>

      <button class="hamburger-button" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul class="navbar-links" :class="{ open: isMenuOpen }">
        <li><router-link to="/" @click="closeMenu">홈</router-link></li>
        <li><router-link to="/popular" @click="closeMenu">대세 컨텐츠</router-link></li>
        <li><router-link to="/search" @click="closeMenu">찾아보기</router-link></li>
        <li><router-link to="/wishlist" @click="closeMenu">내가 찜한 리스트</router-link></li>
        <li v-if="currentUser && isMobile" class="mobile-logout-container">
          <button @click="logout" class="auth-button mobile-logout">로그아웃</button>
        </li>
      </ul>

      <button v-if="currentUser && !isMobile" @click="logout" class="auth-button">로그아웃</button>
    </nav>
    <div class="content"></div>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      currentUser: null,
      isMenuOpen: false,
      isMobile: false,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('currentUser');
      this.currentUser = null;
      alert('You have been logged out.');
      this.$router.push({ path: '/signin' });
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    updateIsMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
  },
  mounted() {
    this.currentUser = localStorage.getItem('currentUser');
    this.updateIsMobile();
    window.addEventListener('resize', this.updateIsMobile);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateIsMobile);
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: flex-start;
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
  margin-right: 20px;
}

.hamburger-button {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 25px;
  height: 20px;
  background: none;
  border: none;
  cursor: pointer;
  margin-left: auto;
}

.hamburger-button span {
  display: block;
  height: 3px;
  width: 100%;
  background: white;
  border-radius: 2px;
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

.navbar-links.open {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 60px;
  left: 0;
  width: 100%;
  background-color: #333;
  padding: 10px 0;
  z-index: 999;
}

.navbar-links.open li {
  margin: 10px 0;
  text-align: center;
}

.mobile-logout-container {
  margin-top: 15px;
  text-align: center;
}

.auth-button.mobile-logout {
  display: block;
  width: 90%;
  margin: 0 auto;
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 0;
  text-align: center;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.auth-button.mobile-logout:hover {
  background-color: #f40612;
}

.auth-button {
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-left: auto;
}

.auth-button:hover {
  background-color: #f40612;
}

.content {
  padding-top: 60px;
}

@media (max-width: 768px) {
  .hamburger-button {
    display: flex;
  }

  .navbar-links {
    display: none;
  }

  .navbar-links.open {
    display: flex;
  }

  .auth-button {
    display: none;
  }

  .content {
    padding-top: 50px;
  }
}
</style>
