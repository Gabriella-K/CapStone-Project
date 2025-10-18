import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load favorites from localStorage when user logs in
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  // Load favorites from localStorage
  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem(`favorites_${user.email}`);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  // Save favorites to localStorage
  const saveFavorites = (updatedFavorites) => {
    try {
      localStorage.setItem(
        `favorites_${user.email}`,
        JSON.stringify(updatedFavorites)
      );
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  // Add song to favorites
  const addFavorite = (song) => {
    if (!user) {
      alert("Please login to add favorites");
      return;
    }

    const exists = favorites.some((fav) => fav.id === song.id);
    if (!exists) {
      const updatedFavorites = [...favorites, song];
      saveFavorites(updatedFavorites);
    }
  };

  // Remove song from favorites
  const removeFavorite = (songId) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== songId);
    saveFavorites(updatedFavorites);
  };

  // Check if song is in favorites
  const isFavorite = (songId) => {
    return favorites.some((fav) => fav.id === songId);
  };

  // Add/Remove favorite (toggle)
  const toggleFavorite = (song) => {
    if (isFavorite(song.id)) {
      removeFavorite(song.id);
    } else {
      addFavorite(song);
    }
  };

  // Get all favorites
  const getFavorites = () => favorites;

  // Create playlist (collection of songs)
  const createPlaylist = (name, songs = []) => {
    const playlist = {
      id: `playlist_${Date.now()}`,
      name,
      songs,
      createdAt: new Date().toISOString(),
    };

    const playlists = JSON.parse(
      localStorage.getItem(`playlists_${user.email}`) || "[]"
    );
    playlists.push(playlist);
    localStorage.setItem(`playlists_${user.email}`, JSON.stringify(playlists));
    return playlist;
  };

  // Get all playlists
  const getPlaylists = () => {
    try {
      return JSON.parse(
        localStorage.getItem(`playlists_${user.email}`) || "[]"
      );
    } catch {
      return [];
    }
  };

  // Add song to playlist
  const addSongToPlaylist = (playlistId, song) => {
    const playlists = getPlaylists();
    const playlist = playlists.find((p) => p.id === playlistId);

    if (playlist) {
      const exists = playlist.songs.some((s) => s.id === song.id);
      if (!exists) {
        playlist.songs.push(song);
        localStorage.setItem(
          `playlists_${user.email}`,
          JSON.stringify(playlists)
        );
      }
    }
  };

  const value = {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    getFavorites,
    createPlaylist,
    getPlaylists,
    addSongToPlaylist,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
};
