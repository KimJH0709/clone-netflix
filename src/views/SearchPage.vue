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

    <div class="table-view" v-if="movies.length">
      <div v-for="row in chunkMovies(movies, 5)" :key="row[0]?.id" class="table-row">
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
      movies: [], // 현재 페이지의 영화 데이터만 저장
      currentPage: 1,
      moviesPerPage: 10, // 한 페이지에 표시할 영화 수
      totalPages: 1, // 전체 페이지 수 계산
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
      loading: false,
    };
  },
  methods: {
    async fetchMovies() {
      try {
        const apiKey = JSON.parse(localStorage.getItem('currentUser')).password;

        this.loading = true;
        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
          params: {
            api_key: apiKey,
            language: 'ko-KR',
            sort_by: this.selectedSort,
            with_genres: this.selectedGenre,
            'vote_average.gte': this.selectedRating,
            page: this.currentPage, // 현재 페이지에 해당하는 데이터만 요청
          },
        });
        this.loading = false;

        this.movies = response.data.results;
        this.totalPages = Math.ceil(response.data.total_results / this.moviesPerPage);
      } catch (error) {
        this.loading = false;
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
        this.fetchMovies();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
        this.fetchMovies();
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
