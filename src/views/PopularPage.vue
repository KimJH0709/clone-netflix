<template>
  <div class="popular-page">
    <h1 class="page-title">대세 콘텐츠</h1>
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
      <div v-if="paginatedMovies.length" class="table">
        <div v-for="row in chunkMovies(paginatedMovies, 5)" :key="row[0].id" class="table-row">
          <div v-for="movie in row" :key="movie.id" class="table-cell">
            <img :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`" :alt="movie.title" />
            <h3>{{ movie.title }}</h3>
          </div>
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
      <div v-if="movies.length" class="movies-grid">
        <div v-for="movie in movies" :key="movie.id" class="movie-card">
          <img :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`" :alt="movie.title" />
          <h3>{{ movie.title }}</h3>
        </div>
        <div v-if="loading" class="loading">로딩 중...</div>
      </div>
      <div v-else>
        <p>영화 데이터를 불러올 수 없습니다.</p>
      </div>
      <button v-show="showTopButton" class="to-top" @click="scrollToTop">
        <i class="fas fa-arrow-up"></i>
      </button>
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
      isTableView: true,
      loading: false,
      showTopButton: false,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.movies.length / this.moviesPerPage);
    },
    paginatedMovies() {
      const start = (this.currentPage - 1) * this.moviesPerPage;
      const end = start + this.moviesPerPage;
      return this.movies.slice(start, end);
    },
  },
  methods: {
    async fetchMovies(page = 1) {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
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

        if (this.isTableView) {
          this.movies = response.data.results;
        } else {
          this.movies = [...this.movies, ...response.data.results];
        }
      } catch (error) {
        this.loading = false;
        console.error('영화 데이터를 가져오는 데 실패했습니다:', error);
        alert('영화 데이터를 가져오는 데 실패했습니다.');
      }
    },
    setTableView() {
      this.isTableView = true;
      this.currentPage = 1;
    },
    setInfiniteScrollView() {
      this.isTableView = false;
      this.movies = [];
      this.fetchMovies();
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
    chunkMovies(movies, chunkSize) {
      const chunks = [];
      for (let i = 0; i < movies.length; i += chunkSize) {
        chunks.push(movies.slice(i, i + chunkSize));
      }
      return chunks;
    },
    handleScroll() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;

      this.showTopButton = scrollTop > 300;

      if (scrollTop + clientHeight >= scrollHeight - 50 && !this.loading) {
        const nextPage = Math.floor(this.movies.length / 20) + 1;
        this.fetchMovies(nextPage);
      }
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  mounted() {
    this.fetchMovies();
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>

<style scoped>
/* 페이지 공통 스타일 */
.popular-page {
  padding: 20px;
  text-align: center;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 20px;
}

/* View 버튼 */
.view-selector {
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
  margin-bottom: 20px;
  gap: 10px; /* 버튼 간 간격 */
}

.view-selector button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  background-color: #e50914;
  color: white;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.view-selector button.active {
  background-color: #b20710;
}

.view-selector button i {
  font-size: 1.2rem;
}

.view-selector button:hover {
  background-color: #d8111b;
}

.table-view .table {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.table-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.table-cell {
  flex: 1;
  text-align: center;
  max-width: 160px;
}

.table-cell img {
  width: 100%;
  height: auto;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 5px;
}

.table-cell h3 {
  font-size: 0.9rem;
  color: #333;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.pagination button {
  padding: 5px 10px;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ddd;
  color: #999;
  cursor: not-allowed;
}

.movies-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.movie-card {
  width: 150px;
  text-align: center;
}

.movie-card img {
  width: 100%;
  height: auto;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 10px;
}

.movie-card h3 {
  font-size: 0.9rem;
  color: #333;
  margin-top: 5px;
}

.loading {
  text-align: center;
  margin-top: 20px;
  font-size: 1.2rem;
}

/* Top 버튼 */
.to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
}

.to-top:hover {
  background-color: #b20710;
}

@media (max-width: 768px) {
  .table-row {
    flex-wrap: wrap;
  }

  .table-cell {
    max-width: 45%;
  }

  .movie-card {
    width: 45%;
  }

  .view-selector {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .table-cell {
    max-width: 100%;
  }

  .movie-card {
    width: 100%;
  }

  .view-selector {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
