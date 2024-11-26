<template>
  <div class="search-page">
    <h1>찾아보기</h1>
    <div class="filters">
      <select v-model="selectedGenre" @change="applyFilters">
        <option value="">장르 선택</option>
        <option v-for="genre in genres" :key="genre.id" :value="genre.id">
          {{ genre.name }}
        </option>
      </select>
      <select v-model="selectedRating" @change="applyFilters">
        <option value="">평점 선택</option>
        <option value="8">8점 이상</option>
        <option value="7">7점 이상</option>
        <option value="6">6점 이상</option>
        <option value="5">5점 이상</option>
      </select>
      <select v-model="selectedSort" @change="applyFilters">
        <option value="popularity.desc">인기순</option>
        <option value="release_date.desc">최신순</option>
        <option value="vote_average.desc">평점순</option>
      </select>
      <button @click="resetFilters">초기화</button>
    </div>

    <div v-if="paginatedMovies.length" class="table-view">
      <div v-for="row in chunkMovies(paginatedMovies, 5)" :key="row[0]?.id" class="table-row">
        <div v-for="movie in row" :key="movie.id" class="table-cell">
          <img :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`" :alt="movie.title" />
          <h3>{{ movie.title }}</h3>
        </div>
      </div>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">이전</button>
        <span>페이지 {{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
      </div>
    </div>
    <div v-else>
      <p>영화 데이터를 불러올 수 없습니다.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SearchPage',
  data() {
    return {
      movies: [],
      currentPage: 1,
      moviesPerPage: 10,
      totalPages: 10,
      genres: [
        { id: 28, name: '액션' },
        { id: 12, name: '모험' },
        { id: 35, name: '코미디' },
        { id: 80, name: '범죄' },
        { id: 16, name: '애니메이션' },
      ],
      selectedGenre: '',
      selectedRating: '',
      selectedSort: 'popularity.desc',
    };
  },
  computed: {
    paginatedMovies() {
      const start = (this.currentPage - 1) * this.moviesPerPage;
      const end = start + this.moviesPerPage;
      return this.movies.slice(start, end);
    },
  },
  methods: {
    async fetchMovies() {
      try {
        const apiKey = JSON.parse(localStorage.getItem('currentUser')).password;
        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
          params: {
            api_key: apiKey,
            language: 'ko-KR',
            sort_by: this.selectedSort,
            with_genres: this.selectedGenre,
            'vote_average.gte': this.selectedRating,
            page: 1,
          },
        });
        this.movies = response.data.results
          .slice(0, this.moviesPerPage * this.totalPages);
      } catch (error) {
        console.error('영화 데이터를 가져오는 데 실패했습니다:', error);
        alert('영화 데이터를 가져오는 데 실패했습니다.');
      }
    },
    chunkMovies(movies, chunkSize) {
      const chunks = [];
      for (let i = 0; i < movies.length; i += chunkSize) {
        chunks.push(movies.slice(i, i + chunkSize));
      }
      return chunks;
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
    applyFilters() {
      this.movies = [];
      this.currentPage = 1;
      this.fetchMovies();
    },
    resetFilters() {
      this.selectedGenre = '';
      this.selectedRating = '';
      this.selectedSort = 'popularity.desc';
      this.applyFilters();
    },
  },
  mounted() {
    this.fetchMovies();
  },
};
</script>

<style scoped>
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filters select,
.filters button {
  padding: 10px;
  font-size: 1rem;
}

.table-view {
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
}

.table-cell img {
  width: 100%;
  height: auto;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 10px;
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
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ddd;
  color: #999;
  cursor: not-allowed;
}

.pagination span {
  display: flex;
  align-items: center;
}
</style>
