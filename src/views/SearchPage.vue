<template>
  <div class="search-page">
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
      wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
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
.search-page {
  padding: 20px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: flex-end;
  flex-wrap: wrap;
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
  width: 100%;
}

.add-to-wishlist {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #ff6666;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.add-to-wishlist:hover {
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

@media (max-width: 768px) {
  .filters {
    justify-content: flex-start;
    flex-direction: column;
  }

  .movies-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }

  .movie-card img {
    width: 90%;
    aspect-ratio: 2 / 3;
  }

  .add-to-wishlist {
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  .pagination {
    flex-direction: column;
    gap: 5px;
  }

  .pagination button {
    width: 100%;
    padding: 8px 0;
  }
}

@media (max-width: 425px) {
  .filters {
    flex-direction: column;
    gap: 5px;
  }

  .movies-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .movie-card img {
    width: 100%;
    aspect-ratio: 2 / 3;
  }

  .add-to-wishlist {
    padding: 6px 8px;
    font-size: 0.8rem;
  }

  .pagination button {
    width: 100%;
    padding: 8px 0;
    font-size: 0.8rem;
  }
}
</style>
