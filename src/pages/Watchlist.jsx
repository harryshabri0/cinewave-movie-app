import { useWatchlistStore } from '../store/useWatchlistStore';
import MovieCard from '../components/MovieCard';
import { Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const Watchlist = () => {
  const { watchlist } = useWatchlistStore();

  return (
    <main className="max-w-7xl mx-auto px-6 pt-24 pb-12 min-h-screen">
      <div className="flex items-center gap-3 mb-10">
        <Bookmark className="text-red-600" size={32} />
        <h1 className="text-3xl font-bold">My Watchlist</h1>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-gray-800 border-dashed">
          <p className="text-gray-500 text-lg mb-6">Your watchlist is empty.</p>
          <Link 
            to="/" 
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            Explore Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Watchlist;