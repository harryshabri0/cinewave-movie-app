import { useState } from 'react';
import { Search, Film, Bookmark, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useWatchlistStore } from '../store/useWatchlistStore';
import { useAuthStore } from '../store/useAuthStore';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  
  // Ambil state dari Zustand Store
  const { watchlist } = useWatchlistStore();
  const { user, logout } = useAuthStore();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?q=${query}`);
      setQuery(''); // Kosongkan input setelah search
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        
        {/* --- LOGO --- */}
        <Link to="/" className="flex items-center gap-2 text-red-600 shrink-0">
          <Film size={28} strokeWidth={2.5} />
          <span className="text-xl font-bold tracking-tighter uppercase hidden sm:block">
            CineWave
          </span>
        </Link>

        {/* --- SEARCH BAR --- */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md hidden md:block">
          <input 
            type="text" 
            placeholder="Search movies..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-900 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-600 border border-gray-700 text-white transition-all placeholder:text-gray-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
        </form>

        {/* --- KANAN: WATCHLIST & USER --- */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* Ikon Watchlist */}
          <Link to="/watchlist" className="relative group p-2 transition-transform active:scale-90">
            <Bookmark className="text-gray-400 group-hover:text-red-600 transition-colors" size={24} />
            {watchlist.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-black animate-in zoom-in">
                {watchlist.length}
              </span>
            )}
          </Link>

          {/* Kondisi Jika Sudah Login vs Belum */}
          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
              {/* Avatar Inisial Nama */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center font-bold text-white uppercase border border-red-500 shadow-lg shadow-red-900/20">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
              
              {/* Nama User (Hanya muncul di layar sedang/besar) */}
              <div className="hidden lg:block">
                <p className="text-xs text-gray-400">Welcome,</p>
                <p className="text-sm font-bold truncate max-w-[100px]">{user.displayName || 'User'}</p>
              </div>

              {/* Tombol Logout */}
              <button 
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors hover:bg-red-600/10 rounded-lg"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="text-gray-400 hover:text-white text-sm font-bold px-4 py-2 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2 rounded-full transition-all shadow-lg shadow-red-600/20 active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;