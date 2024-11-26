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
        <div v-for="row in chunkMovies(paginatedMovies, 5)" :key="row[0]?.id" class="table-row">
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
      <div v-if="infiniteMovies.length" class="movies-grid">
        <div v-for="movie in infiniteMovies" :key="movie.id" class="movie-card">
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
      tableMovies: [],
      infiniteMovies: [],
      currentPage: 1,
      moviesPerPage: 15,
      totalMovies: 150,
      isTableView: true,
      loading: false,
      showTopButton: false,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalMovies / this.moviesPerPage);
    },
    paginatedMovies() {
      const start = (this.currentPage - 1) * this.moviesPerPage;
      const end = start + this.moviesPerPage;
      return this.tableMovies.slice(start, end);
    },
  },
  methods: {
    async fetchTableMovies() {
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
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&region=KR`,
        );
        this.loading = false;

        this.tableMovies = Array.from({ length: this.totalMovies }, (_, i) => ({
          ...response.data.results[i % response.data.results.length],
          id: i + 1,
        }));
      } catch (error) {
        this.loading = false;
        console.error('영화 데이터를 가져오는 데 실패했습니다:', error);
        alert('영화 데이터를 가져오는 데 실패했습니다.');
      }
    },
    async fetchInfiniteMovies(page = 1) {
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

        this.infiniteMovies = [...this.infiniteMovies, ...response.data.results];
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
      this.infiniteMovies = [];
      this.fetchInfiniteMovies();
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
        const nextPage = Math.floor(this.infiniteMovies.length / 20) + 1;
        this.fetchInfiniteMovies(nextPage);
      }
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  mounted() {
    this.fetchTableMovies();
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>

<style scoped>
.popular-page {
  padding: 20px;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 20px;
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

.movies-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.table-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.table-cell img,
.movie-card img {
  aspect-ratio: 2 / 3;
  object-fit: cover;
}
</style>
