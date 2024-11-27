<template>
  <div class="page-container">
    <!-- View Selector -->
    <div class="view-selector">
      <button :class="{ active: isTableView }" @click="setTableView">
        <i class="fas fa-th"></i> Table View
      </button>
      <button :class="{ active: !isTableView }" @click="setInfiniteScrollView">
        <i class="fas fa-stream"></i> Infinite Scroll View
      </button>
    </div>

    <!-- Table View -->
    <div v-if="isTableView" class="table-view">
      <div v-if="paginatedMovies.length" class="movies-grid">
        <div v-for="movie in paginatedMovies" :key="movie.id" class="movie-card">
          <img :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`" :alt="movie.title" />
          <button class="add-to-wishlist" @click="addToWishlist(movie)">찜하기</button>
        </div>
      </div>
      <div v-else>
        <p>영화 데이터를 불러올 수 없습니다.</p>
      </div>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">이전</button>
        <span>페이지 {{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
      </div>
    </div>

    <!-- Infinite Scroll View -->
    <div v-else class="infinite-scroll-view">
      <div v-if="infiniteMovies.length" class="movies-grid">
        <div v-for="movie in infiniteMovies" :key="movie.id" class="movie-card">
          <img :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`" :alt="movie.title" />
          <button class="add-to-wishlist" @click="addToWishlist(movie)">찜하기</button>
        </div>
      </div>
      <div v-else>
        <p>영화 데이터를 불러올 수 없습니다.</p>
      </div>
      <div v-if="loading" class="loading">로딩 중...</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PopularPage',
  data() {
    return {
      movies: [],
      currentPage: 1,
      moviesPerPage: 15,
      totalPages: 0,
      isTableView: true,
      loading: false,
      currentUser: null,
    };
  },
  computed: {
    paginatedMovies() {
      return this.movies;
    },
  },
  methods: {
    async fetchMovies(page = 1) {
      try {
        const { currentUser } = this;
        if (!currentUser || !currentUser.password) {
          alert('로그인이 필요합니다.');
          this.$router.push('/signin');
          return;
        }
        const apiKey = currentUser.password;

        this.loading = true;
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${page}`,
        );
        this.loading = false;

        this.movies = response.data.results;
        this.totalPages = response.data.total_pages;
      } catch (error) {
        this.loading = false;
        console.error('영화 데이터를 가져오는 데 실패했습니다:', error);
        alert('영화 데이터를 가져오는 데 실패했습니다.');
      }
    },
    setTableView() {
      this.isTableView = true;
      this.currentPage = 1;
      this.fetchMovies(this.currentPage);
    },
    setInfiniteScrollView() {
      this.isTableView = false;
      this.movies = [];
      this.fetchMovies();
    },
    async prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
        await this.fetchMovies(this.currentPage);
      }
    },
    async nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
        await this.fetchMovies(this.currentPage);
      }
    },
    addToWishlist(movie) {
      if (!this.currentUser || !this.currentUser.email) {
        alert('로그인이 필요합니다.');
        this.$router.push('/signin');
        return;
      }

      const wishlistKey = `wishlist_${this.currentUser.email}`;
      const wishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];

      if (!wishlist.some((item) => item.id === movie.id)) {
        wishlist.push(movie);
        localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
        alert(`${movie.title}이(가) 위시리스트에 추가되었습니다.`);
      } else {
        alert('이미 위시리스트에 추가된 영화입니다.');
      }
    },
  },
  mounted() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    } else {
      alert('로그인이 필요합니다.');
      this.$router.push('/signin');
    }
    this.fetchMovies(this.currentPage);
  },
};
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.view-selector {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  gap: 10px;
}

.view-selector button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  background-color: #e50914;
  color: white;
  border-radius: 5px;
}

.view-selector button:hover {
  background-color: #b20710;
}

.view-selector button.active {
  font-weight: bold;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.movie-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.movie-card img {
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 10px;
  width: 100%; /* 이미지 크기를 부모 요소에 맞춤 */
}

.add-to-wishlist {
  padding: 8px 12px;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.add-to-wishlist:hover {
  background-color: #b20710;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 10px 20px;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 5px;
}

.pagination button:hover:not(:disabled) {
  background-color: #b20710;
}
</style>
