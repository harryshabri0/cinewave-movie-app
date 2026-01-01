import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { IMAGE_URL } from '../services/tmdb';

const MovieCard = ({ movie }) => {
  // TMDB terkadang tidak memberikan gambar, kita buat placeholder sederhana
  const posterPath = movie.poster_path 
    ? `${IMAGE_URL}${movie.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <Link to={`/movie/${movie.id}`} className="block">
      <div className="group relative bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg border border-gray-800 hover:border-red-600/50">
        
        {/* Poster Image */}
        <div className="aspect-[2/3] w-full overflow-hidden">
          <img 
            src={posterPath} 
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        {/* Info Overlay (Muncul dari bawah dengan gradasi) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-bold text-sm md:text-base line-clamp-1">
              {movie.title}
            </h3>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-gray-200 text-xs font-medium">
                  {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                </span>
              </div>
              
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                {movie.release_date ? movie.release_date.split('-')[0] : "TBA"}
              </span>
            </div>
          </div>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-600/30 rounded-xl pointer-events-none"></div>
      </div>
    </Link>
  );
};

export default MovieCard;