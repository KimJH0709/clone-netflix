<template>
  <div class="homepage">
    <h1>Netflix Clone</h1>
    <div v-if="currentUser" class="user-info">
      <p>Welcome, {{ currentUser.email }}!</p>
      <p>ID: {{ currentUser.email }}</p>
      <p>Password: {{ currentUser.password }}</p>
    </div>

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
      <h2>Popular Movies</h2>
      <div class="movie-scroll-container">
        <div
          class="movie"
          v-for="movie in popularMovies.slice(0, 20)"
          :key="movie.id"
          @mouseenter="showInfo(movie)"
          @mouseleave="hideInfo"
        >
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
          <div v-if="selectedMovie && selectedMovie.id === movie.id" class="movie-info">
            <h3>{{ movie.title }}</h3>
            <p>⭐ {{ movie.vote_average }} • {{ movie.runtime }}분</p>
            <p>{{ movie.overview }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Latest Movies -->
    <div v-if="latestMovies.length" class="movie-section">
      <h2>Latest Movies</h2>
      <div class="movie-scroll-container">
        <div
          class="movie"
          v-for="movie in latestMovies.slice(0, 20)"
          :key="movie.id"
          @mouseenter="showInfo(movie)"
          @mouseleave="hideInfo"
        >
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
          <div v-if="selectedMovie && selectedMovie.id === movie.id" class="movie-info">
            <h3>{{ movie.title }}</h3>
            <p>⭐ {{ movie.vote_average }} • {{ movie.runtime }}분</p>
            <p>{{ movie.overview }}</p>
          </div>
        </div>
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
      selectedMovie: null,
      currentIndex: 0,
      intervalId: null,
    };
  },
  methods: {
    showInfo(movie) {
      this.selectedMovie = movie;
    },
    hideInfo() {
      this.selectedMovie = null;
    },
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
  margin-top: 60px;
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

/* Horizontal Scrollable Movie Section */
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
  transition: transform 0.3s, filter 0.3s;
}

.movie:hover img {
  transform: scale(1.1);
  filter: brightness(80%);
}

.movie-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie:hover .movie-info {
  opacity: 1;
}

.movie-info h3 {
  margin: 0;
  font-size: 1.2rem;
}

.movie-info p {
  margin: 5px 0 0;
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>
