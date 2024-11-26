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

    <div class="infinite-scroll-view">
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
        맨 위로
      </button>
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
      loading: false,
      showTopButton: false,
      genres: [],
      selectedGenre: '',
      selectedRating: '',
      selectedSort: 'popularity.desc',
    };
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
          'https://api.themoviedb.org/3/discover/movie',
          {
            params: {
              api_key: apiKey,
              language: 'ko-KR',
              page,
              with_genres: this.selectedGenre,
              'vote_average.gte': this.selectedRating,
              sort_by: this.selectedSort,
            },
          },
        );
        this.loading = false;

        this.movies = [...this.movies, ...response.data.results];
      } catch (error) {
        this.loading = false;
        console.error('영화 데이터를 가져오는 데 실패했습니다:', error);
        alert('영화 데이터를 가져오는 데 실패했습니다.');
      }
    },
    async fetchGenres() {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || !currentUser.password) {
          alert('로그인이 필요합니다.');
          this.$router.push('/signin');
          return;
        }
        const apiKey = currentUser.password;

        const response = await axios.get(
          'https://api.themoviedb.org/3/genre/movie/list',
          { params: { api_key: apiKey, language: 'ko-KR' } },
        );
        this.genres = response.data.genres;
      } catch (error) {
        console.error('장르 데이터를 가져오는 데 실패했습니다:', error);
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
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  mounted() {
    this.fetchGenres();
    this.fetchMovies();
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;

      this.showTopButton = scrollTop > 300;

      if (scrollTop + clientHeight >= scrollHeight - 50 && !this.loading) {
        this.currentPage += 1;
        this.fetchMovies(this.currentPage);
      }
    });
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

.loading {
  text-align: center;
  margin-top: 20px;
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
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
}

.to-top:hover {
  background-color: #b20710;
}
</style>
