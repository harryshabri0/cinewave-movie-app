import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import { useAuthStore } from './store/useAuthStore';

// Import Halaman
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Watchlist from './pages/Watchlist';
import Recommendations from './pages/Recommendations';
import Login from './pages/Login';
import Register from './pages/Register'; // Import halaman baru
import AllMovies from './pages/AllMovies';

// Import Komponen
import Navbar from './components/navbar';

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  // Pantau status login user saat aplikasi dibuka
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Simpan data user (atau null) ke Zustand
    });

    return () => unsubscribe(); // Cleanup listener saat unmount
  }, [setUser]);

  return (
    <BrowserRouter>
      <div className="bg-[#0a0a0a] min-h-screen text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/all/:type" element={<AllMovies />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;