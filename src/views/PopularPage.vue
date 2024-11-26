<template>
  <div class="popular-page">
    <h1>대세 콘텐츠</h1>
    <div class="view-selector">
      <button :class="{ active: isTableView }"
      @click="setTableView">Table View</button>
      <button :class="{ active: !isTableView }"
      @click="setInfiniteScrollView">Infinite Scroll View</button>
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
      <button v-show="showTopButton" class="to-top" @click="scrollToTop">맨 위로</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PopularPage',
  data() {
    return {
      movies: [], // 전체 영화 데이터
      currentPage: 1, // 현재 페이지 (Table View)
      moviesPerPage: 15, // 페이지당 영화 수 (Table View)
      isTableView: true, // 현재 View 모드
      loading: false, // 로딩 상태 (Infinite Scroll)
      showTopButton: false, // "맨 위로" 버튼 표시 여부
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
.popular-page {
  padding: 20px;
}

.view-selector {
  margin-bottom: 20px;
}

.view-selector button {
  margin-right: 10px;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  background-color: #e50914;
  color: white;
  border-radius: 5px;
}

.view-selector button.active {
  background-color: #b20710;
}

.table-view .table {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.table-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.table-cell {
  flex: 1;
  text-align: center;
}

.table-cell img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
}

.movies-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.movie-card {
  width: 150px;
  text-align: center;
}

.movie-card img {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.loading {
  text-align: center;
  margin: 20px 0;
  font-size: 1.2rem;
}

.to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.to-top:hover {
  background-color: #b20710;
}
</style>
