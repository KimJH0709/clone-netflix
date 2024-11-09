<template>
  <div class="wishlist">
    <h1>내가 찜한 리스트</h1>
    <ul>
      <li v-for="movie in wishlistMovies" :key="movie.id">
        <img :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`" :alt="movie.title" />
        <h3>{{ movie.title }}</h3>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'WishlistPage',
  data() {
    return {
      wishlistMovies: [],
    };
  },
  mounted() {
    this.wishlistMovies = JSON.parse(localStorage.getItem('wishlist')) || [];
  },
};
</script>

<style scoped>
.wishlist {
  padding: 20px;
}

.wishlist ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
}

.wishlist li {
  margin: 10px;
  text-align: center;
}

.wishlist img {
  width: 150px;
  border-radius: 10px;
}
</style>
