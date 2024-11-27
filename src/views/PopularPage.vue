<template>
  <div class="page-container" @scroll.passive="handleScroll">
    <div class="view-selector">
      <button :class="{ active: isTableView }" @click="setTableView">
        <i class="fas fa-th"></i> 테이블뷰
      </button>
      <button :class="{ active: !isTableView }" @click="setInfiniteScrollView">
        <i class="fas fa-stream"></i> 스크롤뷰
      </button>
    </div>

    <div v-if="isTableView" class="table-view">
      <div v-if="movies.length" class="movies-grid">
        <div v-for="movie in movies" :key="movie.id" class="movie-card">
          <img :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`" :alt="movie.title" />
          <button class="add-to-wishlist" @click="addToWishlist(movie)">찜하기</button>
        </div>
      </div>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">이전</button>
        <span>페이지 {{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
      </div>
    </div>

    <div v-else class="infinite-scroll-view">
      <div v-if="movies.length" class="movies-grid">
        <div v-for="movie in movies" :key="movie.id" class="movie-card">
          <img :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`" :alt="movie.title" />
          <button class="add-to-wishlist" @click="addToWishlist(movie)">찜하기</button>
        </div>
        <div v-if="loading" class="loading">로딩 중...</div>
      </div>
    </div>

    <button
      v-if="!isTableView && showScrollToTop"
      class="scroll-to-top"
      @click="scrollToTop"
    >
      ↑
    </button>
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
      totalPages: 0,
      isTableView: true,
      loading: false,
      currentUser: null,
      showScrollToTop: false,
    };
  },
  methods: {
    async fetchMovies(page = 1) {
      if (this.loading) return;

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

        if (this.isTableView) {
          this.movies = response.data.results;
          this.totalPages = Math.min(response.data.total_pages, 10);
        } else {
          this.movies = [...this.movies, ...response.data.results];
          this.totalPages = response.data.total_pages;
        }
      } catch (error) {
        this.loading = false;
        console.error('영화 데이터를 가져오는 데 실패했습니다:', error);
        alert('영화 데이터를 가져오는 데 실패했습니다.');
      }
    },
    setTableView() {
      this.isTableView = true;
      this.movies = [];
      this.currentPage = 1;
      this.showScrollToTop = false;
      this.fetchMovies(this.currentPage);
    },
    setInfiniteScrollView() {
      this.isTableView = false;
      this.movies = [];
      this.currentPage = 1;
      this.fetchMovies(this.currentPage);
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
    handleScroll() {
      if (this.isTableView) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const { clientHeight } = document.documentElement;
      const { scrollHeight } = document.documentElement;

      this.showScrollToTop = scrollTop > 250;

      if (scrollTop + clientHeight >= scrollHeight - 50 && !this.loading) {
        if (this.currentPage < this.totalPages) {
          this.currentPage += 1;
          this.fetchMovies(this.currentPage);
        }
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
        this.fetchMovies(this.currentPage);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
        this.fetchMovies(this.currentPage);
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
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.view-selector {
  display: flex;
  justify-content: right;
  margin-bottom: 20px;
  gap: 10px;
}

.view-selector button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #ff6666;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.view-selector button:hover {
  background-color: #ff3333;
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

.pagination button:disabled {
  background-color: #ddd;
  color: #999;
  cursor: not-allowed;
}

.scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #e50914;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.scroll-to-top:hover {
  background-color: #b20710;
  transform: scale(1.1);
}

.scroll-to-top:active {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .view-selector {
    flex-direction: row;
    justify-content: center;
  }

  .movies-grid {
    grid-template-columns: repeat(4, 1fr);
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
  .view-selector {
    flex-direction: row;
    justify-content: center;
  }

  .movies-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .movie-card img {
    width: 100%;
    aspect-ratio: 2 / 3;
  }

  .view-selector button {
    padding: 8px 15px;
    font-size: 0.9rem;
  }

  .pagination button {
    width: 100%;
    padding: 8px 0;
    font-size: 0.8rem;
  }
}
</style>
