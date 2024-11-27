<template>
  <div class="wishlist">
    <h1>내가 찜한 리스트</h1>
    <div v-if="wishlistMovies.length === 0" class="empty-message">
      찜한 목록이 없습니다.
    </div>
    <ul v-else>
      <li v-for="movie in paginatedMovies" :key="movie.id" class="movie-card">
        <img :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`" :alt="movie.title" />
        <h3>{{ movie.title }}</h3>
        <button @click="removeFromWishlist(movie.id)">찜 지우기</button>
      </li>
    </ul>
    <div v-if="wishlistMovies.length > 0" class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WishlistPage',
  data() {
    return {
      wishlistMovies: [],
      currentUserEmail: null,
      currentPage: 1,
      itemsPerPage: 15,
    };
  },
  computed: {
    paginatedMovies() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.wishlistMovies.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.wishlistMovies.length / this.itemsPerPage);
    },
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
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
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

.empty-message {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 20px;
}

.wishlist ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.movie-card {
  margin: 10px;
  text-align: center;
  width: 150px;
}

.movie-card img {
  width: 100%;
  height: 225px;
  border-radius: 10px;
  object-fit: cover;
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

.pagination span {
  color: white;
  font-size: 1rem;
  display: flex;
  align-items: center;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  padding: 5px 15px;
  margin: 0 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pagination span {
  font-weight: bold;
  margin: 0 10px;
}
</style>
