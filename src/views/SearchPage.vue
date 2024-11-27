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

    <div v-if="movies.length">
      <div class="movies-grid">
        <div v-for="movie in movies" :key="movie.id" class="movie-card">
          <img
            :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`"
            :alt="movie.title"
          />
          <button class="add-to-wishlist" @click="addToWishlist(movie)">
            찜하기
          </button>
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
    <button class="go-to-wishlist" @click="goToWishlist">위시리스트 보기</button>
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
      totalPages: 1,
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
      wishlist: JSON.parse(localStorage.getItem('wishlist')) || [], // 위시리스트 초기화
    };
  },
  methods: {
    async fetchMovies() {
      try {
        const apiKey = JSON.parse(localStorage.getItem('currentUser')).password;

        this.loading = true;
        const response = await axios.get(
          'https://api.themoviedb.org/3/discover/movie',
          {
            params: {
              api_key: apiKey,
              language: 'ko-KR',
              sort_by: this.selectedSort,
              with_genres: this.selectedGenre,
              'vote_average.gte': this.selectedRating,
              page: this.currentPage,
            },
          },
        );
        this.loading = false;

        this.movies = response.data.results;

        const calculatedTotalPages = Math.ceil(
          response.data.total_results / this.moviesPerPage,
        );
        this.totalPages = Math.min(calculatedTotalPages, 10);
      } catch (error) {
        this.loading = false;
        console.error('영화 데이터를 가져오는 데 실패했습니다:', error);
        alert('영화 데이터를 가져오는 데 실패했습니다.');
      }
    },
    addToWishlist(movie) {
      if (!this.currentUser) {
        alert('로그인이 필요합니다.');
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
    goToWishlist() {
      this.$router.push('/wishlist'); // 위시리스트 페이지로 이동
    },
  },
  mounted() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
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

.movies-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  padding: 0 20px;
  justify-content: center;
}

.movie-card img {
  width: 150px;
  height: 225px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.movie-card img:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
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
  transition: background-color 0.3s;
}

.pagination button:hover:not(:disabled) {
  background-color: #b20710;
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

.movie-card {
  position: relative;
  text-align: center;
}

.add-to-wishlist {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #e50914;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.add-to-wishlist:hover {
  background-color: #b20710;
}

.go-to-wishlist {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.go-to-wishlist:hover {
  background-color: #b20710;
}
</style>
