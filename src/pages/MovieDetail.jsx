import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getMovieDetails, 
  getMovieReviews, 
  BACKDROP_URL, 
  IMAGE_URL 
} from '../services/tmdb';
import { useWatchlistStore } from '../store/useWatchlistStore';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Star, ArrowLeft, Clock, Calendar, 
  Bookmark, BookmarkCheck, Play, Users,
  MessageSquare, ChevronRight
} from 'lucide-react';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State Management
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Store Hooks
  const { user } = useAuthStore();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, addToHistory } = useWatchlistStore();

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Ambil data Detail dan Review secara paralel agar lebih cepat
        const [movieData, reviewData] = await Promise.all([
          getMovieDetails(id),
          getMovieReviews(id)
        ]);
        
        setMovie(movieData);
        setReviews(reviewData);
        
        // Simpan ke riwayat untuk algoritma rekomendasi di Home
        addToHistory(movieData);
      } catch (err) {
        console.error("Error fetching movie data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
    window.scrollTo(0, 0); // Reset scroll ke atas
  }, [id, addToHistory]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!movie) return <div className="pt-32 text-center text-white">Movie not found.</div>;

  const isFavorite = isInWatchlist(movie.id);
  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' || v.type === 'Teaser');

  // Proteksi Tombol Watchlist
  const handleWatchlistToggle = () => {
    if (!user) {
      alert("Please login first to manage your watchlist!");
      navigate('/login');
      return;
    }
    isFavorite ? removeFromWatchlist(movie.id) : addToWatchlist(movie);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] pb-20 text-white overflow-x-hidden">
      
      {/* --- HERO SECTION (BACKDROP) --- */}
      <div className="absolute inset-0 h-[650px] w-full">
        <img 
          src={movie.backdrop_path ? `${BACKDROP_URL}${movie.backdrop_path}` : ''} 
          className="w-full h-full object-cover opacity-30"
          alt="backdrop"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-28">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* KOLOM KIRI: POSTER & BACK */}
          <div className="w-full lg:w-[350px] shrink-0">
            <button 
              onClick={() => navigate(-1)} 
              className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
              <span className="font-medium">Back to Browsing</span>
            </button>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-800 sticky top-28">
              <img 
                src={movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} 
                className="w-full hover:scale-105 transition-transform duration-700"
                alt={movie.title}
              />
            </div>
          </div>

          {/* KOLOM KANAN: INFO */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tighter">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 mb-10 text-gray-300">
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 rounded-lg text-yellow-500 font-bold border border-yellow-500/20">
                <Star size={18} className="fill-yellow-500" />
                <span>{movie.vote_average?.toFixed(1)}</span>
              </div>
              <span className="flex items-center gap-2 font-medium">
                <Clock size={18} className="text-red-600" /> {movie.runtime} min
              </span>
              <span className="flex items-center gap-2 font-medium">
                <Calendar size={18} className="text-red-600" /> 
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
              </span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-4 mb-12">
              {trailer && (
                <a 
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white text-black font-extrabold py-4 px-10 rounded-full hover:bg-red-600 hover:text-white transition-all transform active:scale-95"
                >
                  <Play size={20} fill="currentColor" /> Watch Trailer
                </a>
              )}
              
              <button 
                onClick={handleWatchlistToggle}
                className={`flex items-center gap-3 font-bold py-4 px-10 rounded-full border-2 transition-all active:scale-95 ${
                  isFavorite 
                  ? 'border-red-600 bg-red-600/10 text-red-600' 
                  : 'border-gray-700 bg-gray-900/50 text-gray-300 hover:border-white hover:text-white'
                }`}
              >
                {isFavorite ? <BookmarkCheck size={22} /> : <Bookmark size={22} />}
                {isFavorite ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
            </div>

            {/* SYNOPSIS */}
            <div className="mb-12 max-w-3xl">
              <h3 className="text-red-600 font-bold uppercase tracking-[0.2em] text-xs mb-4">Synopsis</h3>
              {movie.tagline && (
                <p className="text-gray-300 leading-relaxed text-xl font-light italic mb-4 opacity-80">
                  "{movie.tagline}"
                </p>
              )}
              <p className="text-gray-400 leading-relaxed text-lg">
                {movie.overview}
              </p>
            </div>

            {/* CAST SECTION */}
            <div className="mb-20">
              <div className="flex items-center gap-2 mb-8">
                <Users size={20} className="text-red-600" />
                <h3 className="font-bold uppercase tracking-widest text-sm text-gray-200">Featured Cast</h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                {movie.credits?.cast?.slice(0, 6).map(actor => (
                  <div key={actor.id} className="text-center group">
                    <div className="aspect-square rounded-full overflow-hidden border-2 border-gray-800 mb-3 group-hover:border-red-600 transition-all duration-300 transform group-hover:scale-105">
                      <img 
                        src={actor.profile_path ? `${IMAGE_URL}${actor.profile_path}` : 'https://via.placeholder.com/200'} 
                        className="w-full h-full object-cover"
                        alt={actor.name}
                      />
                    </div>
                    <p className="text-[11px] font-bold text-white leading-tight mb-1">{actor.name}</p>
                    <p className="text-[9px] text-gray-500 uppercase">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* --- GLOBAL REVIEWS SECTION (TMDB) --- */}
            <div className="max-w-4xl border-t border-gray-800 pt-16">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-600/10 rounded-lg">
                    <MessageSquare className="text-red-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tighter">Global Reviews</h3>
                </div>
                <span className="text-gray-500 text-sm font-medium">{reviews.length} Reviews found</span>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-8">
                  {reviews.slice(0, 5).map((rev) => (
                    <div key={rev.id} className="bg-gray-900/20 p-8 rounded-3xl border border-gray-800/50 hover:bg-gray-900/40 transition-colors">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-600 to-gray-800 flex items-center justify-center font-bold text-lg border border-gray-700 uppercase">
                            {rev.author.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-lg">{rev.author}</h4>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar size={12} /> 
                                {new Date(rev.created_at).toLocaleDateString()}
                              </span>
                              {rev.author_details?.rating && (
                                <span className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded">
                                  <Star size={10} fill="currentColor" />
                                  {rev.author_details.rating}/10
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-400 leading-relaxed text-sm italic line-clamp-4 hover:line-clamp-none transition-all cursor-pointer">
                        "{rev.content}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-900/10 rounded-3xl border border-gray-800 border-dashed">
                  <p className="text-gray-500 italic">No community reviews available for this movie yet.</p>
                </div>
              )}
            </div>
            {/* --- END REVIEWS --- */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;