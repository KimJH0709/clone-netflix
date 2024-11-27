<template>
  <div class="homepage">
    <!-- Top 5 Popular Movies Section -->
    <div v-if="topMovies.length" class="top-movies-container">
      <button class="arrow left-arrow" @click="prevMovie">〈</button>
      <div class="top-movie">
        <img :src="`https://image.tmdb.org/t/p/w1280${topMovies[currentIndex].backdrop_path}`" :alt="topMovies[currentIndex].title" />
        <div class="top-movie-info">
          <h2>{{ topMovies[currentIndex].title }}</h2>
          <p>{{ topMovies[currentIndex].overview }}</p>
          <button>재생</button>
          <button>상세 정보</button>
        </div>
      </div>
      <button class="arrow right-arrow" @click="nextMovie">〉</button>
    </div>

    <!-- Popular Movies -->
    <div v-if="popularMovies.length" class="movie-section">
      <h2>인기 영화</h2>
      <div class="movie-scroll-container">
        <div
          class="movie"
          v-for="movie in popularMovies.slice(0, 20)"
          :key="movie.id"
          @click="openModal(movie)"
        >
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
        </div>
      </div>
    </div>

    <!-- Latest Movies -->
    <div v-if="latestMovies.length" class="movie-section">
      <h2>최신 영화</h2>
      <div class="movie-scroll-container">
        <div
          class="movie"
          v-for="movie in latestMovies.slice(0, 20)"
          :key="movie.id"
          @click="openModal(movie)"
        >
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
        </div>
      </div>
    </div>

    <!-- Movie Detail Modal -->
    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeModal">X</button>
        <img :src="`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`" :alt="selectedMovie.title" />
        <h2>{{ selectedMovie.title }}</h2>
        <p>{{ selectedMovie.overview }}</p>
        <button @click="addToWishlist(selectedMovie)">찜하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomePage',
  data() {
    return {
      currentUser: null,
      topMovies: [],
      popularMovies: [],
      latestMovies: [],
      currentIndex: 0,
      intervalId: null,
      isModalOpen: false,
      selectedMovie: null,
    };
  },
  methods: {
    nextMovie() {
      this.currentIndex = (this.currentIndex + 1) % this.topMovies.length;
    },
    prevMovie() {
      this.currentIndex = (this.currentIndex - 1 + this.topMovies.length) % this.topMovies.length;
    },
    startAutoSlide() {
      this.intervalId = setInterval(this.nextMovie, 5000);
    },
    stopAutoSlide() {
      clearInterval(this.intervalId);
    },
    openModal(movie) {
      this.selectedMovie = movie;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.selectedMovie = null;
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
        alert('영화가 찜 목록에 추가되었습니다.');
      } else {
        alert('이미 찜 목록에 추가된 영화입니다.');
      }
    },
  },
  mounted() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      const apiKey = this.currentUser.password;

      axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`)
        .then((response) => {
          this.popularMovies = response.data.results;
          this.topMovies = this.popularMovies.slice(0, 5);
        })
        .catch((error) => {
          console.error('Failed to fetch popular movies:', error);
        });

      axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR`)
        .then((response) => {
          this.latestMovies = response.data.results;
        })
        .catch((error) => {
          console.error('Failed to fetch latest movies:', error);
        });
    }

    this.startAutoSlide();
  },
  beforeDestroy() {
    this.stopAutoSlide();
  },
};
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  min-height: 100%;
  height: 100%;
  overflow-y: auto;
}

.homepage {
  padding: 20px;
}

.top-movies-container {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
}

.top-movie {
  flex: 1;
  height: 500px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

.top-movie img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.top-movie-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  max-width: 50%;
}

.top-movie-info h2 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.top-movie-info p {
  font-size: 1rem;
  margin-bottom: 10px;
}

.top-movie-info button {
  padding: 10px 20px;
  margin-right: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.top-movie-info button:hover {
  background-color: rgba(255, 255, 255, 1);
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  cursor: pointer;
  padding: 10px;
  z-index: 10;
}

.left-arrow {
  left: 10px;
}

.right-arrow {
  right: 10px;
}

.movie-section {
  margin-bottom: 40px;
}

.movie-scroll-container {
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding-bottom: 10px;
}

.movie {
  min-width: 200px;
  height: 300px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.movie img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  transition: filter 0.3s;
}

.movie:hover img {
  filter: brightness(80%);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 10px; /* 모바일 환경에서 양쪽 여백 추가 */
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  padding-top: 60px;
}

.modal-content img {
  width: 100%;
  border-radius: 10px;
}

.modal-content h2 {
  margin-top: 15px;
  font-size: 1.5rem;
}

.modal-content p {
  font-size: 1rem;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.4;
}

.modal-content button {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px 0;
  background: #e50914;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.modal-content button:hover {
  background: #b20710;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 5px;
  background: transparent;
  color: #333;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 20;
  font-size: 1.5rem;
  line-height: 1;
  padding: 5px;
  transition: transform 0.3s ease, color 0.3s ease;
}

.close-button:hover {
  transform: scale(1.2);
  color: #f00;
}

@media (max-width: 768px) {
  .modal-content h2 {
    font-size: 1.2rem;
  }

  .modal-content p {
    font-size: 0.9rem;
  }

  .modal-content button {
    font-size: 0.9rem;
  }

  .close-button {
    font-size: 1.2rem;
    padding: 8px;
  }
}
</style>
