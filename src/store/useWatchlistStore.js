import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tambahkan 'history' ke dalam store yang sudah ada
export const useWatchlistStore = create(
  persist(
    (set, get) => ({
      watchlist: [],
      history: [], // Riwayat film yang dikunjungi
      
      addToWatchlist: (movie) => { /* ... kode lama ... */ },
      removeFromWatchlist: (movieId) => { /* ... kode lama ... */ },
      isInWatchlist: (movieId) => { /* ... kode lama ... */ },

      // Fungsi baru untuk mencatat riwayat kunjungan
      addToHistory: (movie) => {
        const currentHistory = get().history;
        // Hapus jika film sudah ada di riwayat (agar tidak duplikat)
        const filtered = currentHistory.filter(m => m.id !== movie.id);
        // Tambahkan ke urutan paling atas, batasi maksimal 5 film
        set({ history: [movie, ...filtered].slice(0, 5) });
      }
    }),
    { name: 'movie-watchlist' }
  )
);