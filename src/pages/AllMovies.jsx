import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getTrendingMovies, getMoviesByGenre } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { ArrowLeft, Loader2 } from 'lucide-react';

const AllMovies = () => {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const genreId = searchParams.get('id');
  const genreName = searchParams.get('name');
  
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Ref untuk mendeteksi elemen terakhir
  const observer = useRef();
  const lastMovieElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Reset saat ganti kategori
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [type, genreId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let res;
        if (type === 'trending') {
          res = await getTrendingMovies(page);
        } else if (type === 'genre' && genreId) {
          res = await getMoviesByGenre(genreId, page);
        }

        setMovies(prev => [...prev, ...res.results]);
        setHasMore(res.page < res.total_pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, genreId, page]);

  return (
    <main className="max-w-7xl mx-auto px-6 pt-24 pb-12 min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <h1 className="text-3xl font-bold mb-10 capitalize">
        {type === 'trending' ? '🔥 Trending Now' : `Kategori: ${genreName}`}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
        {movies.map((movie, index) => {
          if (movies.length === index + 1) {
            return (
              <div ref={lastMovieElementRef} key={`${movie.id}-${index}`}>
                <MovieCard movie={movie} />
              </div>
            );
          } else {
            return <MovieCard key={`${movie.id}-${index}`} movie={movie} />;
          }
        })}
      </div>

      {/* Loading Indicator di Bawah */}
      {loading && (
        <div className="flex justify-center mt-10">
          <Loader2 className="text-red-600 animate-spin" size={40} />
        </div>
      )}

      {!hasMore && !loading && (
        <p className="text-center text-gray-500 mt-10 italic">You've reached the end of the list.</p>
      )}
    </main>
  );
};

export default AllMovies;