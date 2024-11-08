<template>
  <div class="homepage">
    <h1>Netflix Clone</h1>
    <div v-if="currentUser" class="user-info">
      <p>Welcome, {{ currentUser.email }}!</p>
      <p>ID: {{ currentUser.email }}</p>
      <p>Password: {{ currentUser.password }}</p>
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
            <p>
              ⭐ {{ movie.vote_average }} • {{ movie.genre_ids.join(', ') }} • {{ movie.runtime }}분
            </p>
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
            <p>
              ⭐ {{ movie.vote_average }} • {{ movie.genre_ids.join(', ') }} • {{ movie.runtime }}분
            </p>
            <p>{{ movie.overview }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Movies -->
    <div v-if="actionMovies.length" class="movie-section">
      <h2>Action Movies</h2>
      <div class="movie-scroll-container">
        <div
          class="movie"
          v-for="movie in actionMovies.slice(0, 20)"
          :key="movie.id"
          @mouseenter="showInfo(movie)"
          @mouseleave="hideInfo"
        >
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
          <div v-if="selectedMovie && selectedMovie.id === movie.id" class="movie-info">
            <h3>{{ movie.title }}</h3>
            <p>
              ⭐ {{ movie.vote_average }} • {{ movie.genre_ids.join(', ') }} • {{ movie.runtime }}분
            </p>
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
      popularMovies: [],
      latestMovies: [],
      actionMovies: [],
      selectedMovie: null,
    };
  },
  methods: {
    showInfo(movie) {
      this.selectedMovie = movie;
    },
    hideInfo() {
      this.selectedMovie = null;
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

      axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=28&language=ko-KR`)
        .then((response) => {
          this.actionMovies = response.data.results;
        })
        .catch((error) => {
          console.error('Failed to fetch action movies:', error);
        });
    }
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
