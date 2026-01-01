import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  getTrendingMovies, 
  searchMovies, 
  getGenres, 
  getMoviesByGenre,
  tmdbClient 
} from '../services/tmdb';
import { useWatchlistStore } from '../store/useWatchlistStore';
import MovieCard from '../components/MovieCard';
import { Sparkles, Flame } from 'lucide-react';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const { history } = useWatchlistStore();

  const query = searchParams.get('q');
  const currentGenre = searchParams.get('genre');

  // 1. Ambil daftar genre saat pertama kali load
  useEffect(() => {
    getGenres().then(setGenres).catch(console.error);
  }, []);

  // 2. Logika Rekomendasi Pintar (Analisis Top 3 Genre dari History)
  useEffect(() => {
    const fetchSmartRecs = async () => {
      if (history.length > 0 && !query && !currentGenre) {
        try {
          const genreCounts = {};
          history.forEach(movie => {
            const ids = movie.genre_ids || movie.genres?.map(g => g.id) || [];
            ids.forEach(id => {
              genreCounts[id] = (genreCounts[id] || 0) + 1;
            });
          });

          const topGenreIds = Object.entries(genreCounts)
            .sort((a, b) => b[1] - a[1]) 
            .slice(0, 3)                
            .map(entry => entry[0])      
            .join(',');                 

          const response = await tmdbClient.get('/discover/movie', {
            params: {
              with_genres: topGenreIds,
              sort_by: 'popularity.desc'
            }
          });

          setRecommendations(response.data.results.slice(0, 5));
        } catch (err) {
          console.error("Gagal memuat rekomendasi:", err);
        }
      } else {
        setRecommendations([]);
      }
    };
    fetchSmartRecs();
  }, [history, query, currentGenre]);

  // 3. Logika List Utama (Trending / Search / Genre)
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let data;
        if (query) {
          data = await searchMovies(query); // Search biasanya mengembalikan array langsung atau butuh .results
        } else if (currentGenre) {
          const res = await getMoviesByGenre(currentGenre);
          data = res.results; // Ambil 20 film pertama saja (halaman 1)
        } else {
          const res = await getTrendingMovies();
          data = res.results; // Ambil 20 film pertama saja (halaman 1)
        }
        
        // Jika data adalah objek (hasil dari perubahan tmdb.js tadi)
        setMovies(data?.results || data); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [query, currentGenre]);

  return (
    <main className="max-w-7xl mx-auto px-6 pt-24 pb-12 min-h-screen">
      
      {/* --- SECTION 1: SMART RECOMMENDATIONS --- */}
      {recommendations.length > 0 && !query && !currentGenre && (
        <section className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative z-20 flex items-start justify-between mb-8">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-600/10 rounded-lg shrink-0 mt-1">
                <Sparkles className="text-red-600 fill-red-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Recommended For You</h2>
                <p className="text-gray-500 text-xs md:text-sm">Based on your taste</p>
              </div>
            </div>
            
            <Link 
              to="/recommendations" 
              className="text-red-600 hover:text-red-500 text-sm font-bold flex items-center gap-1 group transition-all pt-2"
            >
              See All 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {recommendations.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <div className="mt-12 border-b border-gray-800/50"></div>
        </section>
      )}

      {/* --- SECTION 2: GENRE PILLS (Scrollable) --- */}
      {!query && (
        <div className="flex gap-3 overflow-x-auto pb-6 mb-10 genre-scroll scroll-smooth snap-x snap-mandatory">
          <button 
            onClick={() => setSearchParams({})}
            className={`snap-start px-6 py-2 rounded-full text-sm font-semibold transition-all border whitespace-nowrap ${
              !currentGenre ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'
            }`}
          >
            All Trending
          </button>
          {genres.map(genre => (
            <button 
              key={genre.id}
              onClick={() => setSearchParams({ genre: genre.id })}
              className={`snap-start px-6 py-2 rounded-full text-sm font-semibold transition-all border whitespace-nowrap ${
                currentGenre == genre.id ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      )}

      {/* --- SECTION 3: MAIN CONTENT HEADER --- */}
      <div className="relative z-20 flex items-baseline justify-between mb-12">
        <div className="flex items-center gap-3">
          {!query && !currentGenre && <Flame className="text-red-600 fill-red-600" size={28} />}
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none">
            {query ? `Results: ${query}` : currentGenre ? genres.find(g => g.id == currentGenre)?.name : 'Trending Now'}
          </h1>
        </div>

        {!query && (
          <Link 
            to={currentGenre 
              ? `/all/genre?id=${currentGenre}&name=${genres.find(g => g.id == currentGenre)?.name}` 
              : '/all/trending'
            }
            className="text-red-600 hover:text-red-500 text-sm font-bold flex items-center gap-1 group transition-all -translate-y-1"
          >
            See All 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        )}
      </div>

      {/* --- SECTION 4: MOVIE GRID --- */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-900 animate-pulse rounded-2xl border border-gray-800"></div>
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/30 rounded-3xl border border-gray-800 border-dashed">
          <p className="text-gray-500">No movies found for this selection.</p>
        </div>
      )}
    </main>
  );
};

export default Home;