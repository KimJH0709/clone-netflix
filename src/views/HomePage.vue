<template>
  <div class="homepage">
    <h1>Netflix Clone</h1>
    <div v-if="currentUser" class="user-info">
      <p v-if="typeof currentUser === 'object'">
        Welcome, {{ currentUser.email }}!
      </p>
      <p v-if="typeof currentUser === 'object'">
        Password: {{ currentUser.password }}
      </p>
      <p v-else>
        Welcome, {{ currentUser }}!
      </p>
    </div>
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
  mounted() {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        // JSON으로 파싱 가능한지 확인
        this.currentUser = storedUser.startsWith('{') ? JSON.parse(storedUser) : storedUser;
      } else {
        alert('You need to log in first.');
        this.$router.push({ path: '/signin' });
      }
    } catch (e) {
      console.error('Failed to parse user data:', e);
      alert('Error reading user data. Please log in again.');
      localStorage.removeItem('currentUser');
      this.$router.push({ path: '/signin' });
    }
  },
};
</script>

<style scoped>
.homepage {
  padding: 20px;
}
</style>
