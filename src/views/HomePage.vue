<template>
  <div class="homepage">
    <h1>Netflix Clone</h1>
    <div v-if="currentUser" class="user-info">
      <p>Welcome, {{ currentUser.email }}!</p>
      <p>ID: {{ currentUser.email }}</p>
      <p>Password: {{ currentUser.password }}</p>
    </div>

    <div v-if="popularMovies.length" class="movies-grid">
      <h2>Popular Movies</h2>
      <div class="movies-container">
        <div class="movie" v-for="movie in popularMovies.slice(0, 20)" :key="movie.id">
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
          <p>{{ movie.title }}</p>
        </div>
      </div>
    </div>

    <div v-if="latestMovies.length" class="movies-grid">
      <h2>Latest Movies</h2>
      <div class="movies-container">
        <div class="movie" v-for="movie in latestMovies.slice(0, 20)" :key="movie.id">
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
          <p>{{ movie.title }}</p>
        </div>
      </div>
    </div>

    <div v-if="actionMovies.length" class="movies-grid">
      <h2>Action Movies</h2>
      <div class="movies-container">
        <div class="movie" v-for="movie in actionMovies.slice(0, 20)" :key="movie.id">
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
          <p>{{ movie.title }}</p>
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
    };
  },
  mounted() {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        const apiKey = this.currentUser.password;

        axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`)
          .then((response) => {
            this.popularMovies = response.data.results;
          })
          .catch((error) => {
            console.error('Failed to fetch popular movies:', error);
          });

        axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`)
          .then((response) => {
            this.latestMovies = response.data.results;
          })
          .catch((error) => {
            console.error('Failed to fetch latest movies:', error);
          });

        axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=28`)
          .then((response) => {
            this.actionMovies = response.data.results;
          })
          .catch((error) => {
            console.error('Failed to fetch action movies:', error);
          });
      } else {
        alert('You need to log in first.');
        this.$router.push({ path: '/signin' });
      }
    } catch (e) {
      console.error('Failed to parse user data:', e);
      alert('Error reading user data. Please log in again.');
      localStorage.removeItem('currentUser');
      this.$router.push({ path: '/signin' });
    }
  },
};
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  min-height: 100%;
  height: auto;
  overflow-y: auto;
}

.homepage {
  padding: 20px;
}

.movies-grid {
  margin-top: 20px;
}

.movies-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.movie {
  text-align: center;
}

.movie img {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.movie p {
  margin-top: 10px;
  font-size: 1rem;
}
</style>
