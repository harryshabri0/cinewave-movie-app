import axios from 'axios';

// 1. Ambil token dari file .env
const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

// 2. Buat instance Axios agar tidak perlu menulis header berulang kali
export const tmdbClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

// 3. Konstanta untuk URL Gambar (TMDB tidak memberikan URL lengkap di API-nya)
export const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

// 4. Fungsi-fungsi untuk mengambil data (API Endpoints)

// Mengambil film yang sedang trending hari ini
export const getTrendingMovies = async (page = 1) => {
  const response = await tmdbClient.get('/trending/movie/day', {
    params: { page }
  });
  return response.data; // Kita butuh seluruh object data untuk cek total_pages
};

// Mencari film berdasarkan kata kunci (untuk fitur Search)
export const searchMovies = async (query) => {
  try {
    const response = await tmdbClient.get('/search/movie', {
      params: { query: query }
    });
    return response.data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

// Mengambil detail lengkap satu film berdasarkan ID
export const getMovieDetails = async (id) => {
  try {
    const response = await tmdbClient.get(`/movie/${id}`, {
      params: { append_to_response: 'videos,credits' } // Mengambil trailer & aktor sekaligus
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
  
};
// Tambahkan ini di tmdb.js
export const getGenres = async () => {
  const response = await tmdbClient.get('/genre/movie/list');
  return response.data.genres;
};

export const getMoviesByGenre = async (genreId, page = 1) => {
  const response = await tmdbClient.get('/discover/movie', {
    params: { with_genres: genreId, page }
  });
  return response.data;
};
export const getRecommendations = async (movieId) => {
  const response = await tmdbClient.get(`/movie/${movieId}/recommendations`);
  return response.data.results;
};
// Tambahkan ke dalam file tmdb.js
export const getMovieReviews = async (movieId) => {
  const response = await tmdbClient.get(`/movie/${movieId}/reviews`);
  return response.data.results; // Mengembalikan array ulasan
};
export default tmdbClient;