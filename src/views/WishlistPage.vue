<template>
  <div class="wishlist">
    <h1>내가 찜한 리스트</h1>
    <ul>
      <li v-for="movie in wishlistMovies" :key="movie.id" class="movie-card">
        <img :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`" :alt="movie.title" />
        <h3>{{ movie.title }}</h3>
        <button @click="removeFromWishlist(movie.id)">찜 지우기</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'WishlistPage',
  data() {
    return {
      wishlistMovies: [],
      currentUserEmail: null,
    };
  },
  methods: {
    loadWishlist() {
      const wishlistKey = `wishlist_${this.currentUserEmail}`;
      this.wishlistMovies = JSON.parse(localStorage.getItem(wishlistKey)) || [];
    },
    removeFromWishlist(movieId) {
      this.wishlistMovies = this.wishlistMovies.filter((movie) => movie.id !== movieId);
      const wishlistKey = `wishlist_${this.currentUserEmail}`;
      localStorage.setItem(wishlistKey, JSON.stringify(this.wishlistMovies));
      alert('영화를 찜 목록에서 제거했습니다.');
    },
  },
  mounted() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.email) {
      this.currentUserEmail = currentUser.email;
      this.loadWishlist();
    } else {
      alert('로그인이 필요합니다.');
      this.$router.push('/signin');
    }
  },
};
</script>

<style scoped>
.wishlist {
  padding: 20px;
}

.wishlist ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
}

.movie-card {
  margin: 10px;
  text-align: center;
}

.movie-card img {
  width: 150px;
  border-radius: 10px;
}

button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #ff6666;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background-color: #ff3333;
}
</style>
