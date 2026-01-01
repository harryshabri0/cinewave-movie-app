import { useEffect, useState } from 'react';
import { tmdbClient } from '../services/tmdb';
import { useWatchlistStore } from '../store/useWatchlistStore';
import MovieCard from '../components/MovieCard';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Recommendations = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { history } = useWatchlistStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllRecs = async () => {
      if (history.length === 0) return setLoading(false);
      
      try {
        // Hitung Top 3 Genre
        const genreCounts = {};
        history.forEach(movie => {
          const ids = movie.genre_ids || movie.genres?.map(g => g.id) || [];
          ids.forEach(id => genreCounts[id] = (genreCounts[id] || 0) + 1);
        });

        const topGenres = Object.entries(genreCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(e => e[0]).join(',');

        const res = await tmdbClient.get('/discover/movie', {
          params: { with_genres: topGenres, sort_by: 'popularity.desc' }
        });
        setMovies(res.data.results);
      } finally {
        setLoading(false);
      }
    };
    fetchAllRecs();
  }, [history]);

  return (
    <main className="max-w-7xl mx-auto px-6 pt-24 pb-12 min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="flex items-center gap-3 mb-10">
        <Sparkles className="text-yellow-500 fill-yellow-500" size={32} />
        <h1 className="text-3xl font-bold">Recommended For You</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => <div key={i} className="aspect-[2/3] bg-gray-900 animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      )}
    </main>
  );
};

export default Recommendations;