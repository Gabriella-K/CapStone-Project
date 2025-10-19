import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load favorites from localStorage when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User authenticated, loading favorites for:", user.email);
      loadFavorites();
    } else {
      console.log("User not authenticated, clearing favorites");
      setFavorites([]);
    }
  }, [isAuthenticated, user]);

  // Load favorites from localStorage
  const loadFavorites = () => {
    try {
      if (!user || !user.email) {
        console.log("No user email available");
        return;
      }

      const stored = localStorage.getItem(`favorites_${user.email}`);
      console.log("Loading favorites for", user.email, ":", stored);

      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(parsed);
        console.log("Loaded favorites:", parsed);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      setFavorites([]);
    }
  };

  // Save favorites to localStorage
  const saveFavorites = (updatedFavorites) => {
    try {
      if (!user || !user.email) {
        console.error("Cannot save: No user email");
        return;
      }

      const key = `favorites_${user.email}`;
      localStorage.setItem(key, JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
      console.log("Saved favorites for", user.email, ":", updatedFavorites);
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  // Add song to favorites
  const addFavorite = (song) => {
    console.log(
      "Adding favorite. User:",
      user,
      "IsAuthenticated:",
      isAuthenticated
    );

    if (!isAuthenticated || !user || !user.email) {
      console.warn("User not authenticated - cannot add favorite");
      alert("Please login to add favorites");
      return false;
    }

    if (!song || !song.id) {
      console.error("Invalid song");
      return false;
    }

    const exists = favorites.some((fav) => fav.id === song.id);
    if (!exists) {
      const updatedFavorites = [...favorites, song];
      saveFavorites(updatedFavorites);
      console.log("Favorite added:", song.title);
      return true;
    } else {
      console.log("Song already in favorites");
      return false;
    }
  };

  // Remove song from favorites
  const removeFavorite = (songId) => {
    if (!isAuthenticated || !user) {
      alert("Please login to manage favorites");
      return;
    }

    const updatedFavorites = favorites.filter((fav) => fav.id !== songId);
    saveFavorites(updatedFavorites);
    console.log("Favorite removed:", songId);
  };

  // Check if song is in favorites
  const isFavorite = (songId) => {
    return favorites.some((fav) => fav.id === songId);
  };

  // Add/Remove favorite (toggle)
  const toggleFavorite = (song) => {
    console.log(
      "Toggling favorite. User:",
      user,
      "IsAuthenticated:",
      isAuthenticated
    );

    if (!isAuthenticated || !user) {
      console.warn("Cannot toggle: User not authenticated");
      alert("Please login to add favorites");
      return;
    }

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
    if (!isAuthenticated || !user) {
      alert("Please login to create playlists");
      return null;
    }

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
    console.log("Playlist created:", name);
    return playlist;
  };

  // Get all playlists
  const getPlaylists = () => {
    try {
      if (!user || !user.email) {
        return [];
      }

      const playlists = JSON.parse(
        localStorage.getItem(`playlists_${user.email}`) || "[]"
      );
      console.log("Retrieved playlists:", playlists);
      return playlists;
    } catch (error) {
      console.error("Error getting playlists:", error);
      return [];
    }
  };

  // Add song to playlist
  const addSongToPlaylist = (playlistId, song) => {
    if (!isAuthenticated || !user) {
      alert("Please login to add songs to playlists");
      return;
    }

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
        console.log("Song added to playlist:", song.title);
      }
    }
  };

  const value = {
    favorites,
    loading,
    isAuthenticated,
    user,
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
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
};
