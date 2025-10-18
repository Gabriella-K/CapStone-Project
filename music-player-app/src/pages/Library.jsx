import React, { useState, useEffect } from "react";
import { useFavorites } from "../context/FavoriteContext";
import { usePlayer } from "../context/PlayerContext";
import "./Library.css";

const Library = () => {
  const { playSong } = usePlayer();
  const { favorites, isFavorite, toggleFavorite, getPlaylists } =
    useFavorites();
  const [activeTab, setActiveTab] = useState("favorites");
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    // Load user playlists
    const userPlaylists = getPlaylists();
    setPlaylists(userPlaylists);
  }, []);

  const handlePlaySong = (song) => {
    if (song && song.preview) {
      playSong(song);
    }
  };

  const handleToggleFavorite = (e, song) => {
    e.stopPropagation();
    toggleFavorite(song);
  };

  return (
    <div className="library-page">
      <h2 className="library-title">Your Library</h2>

      {/* Tab Navigation */}
      <div className="library-tabs">
        <button
          className={`tab ${activeTab === "favorites" ? "active" : ""}`}
          onClick={() => setActiveTab("favorites")}
        >
          Favorites ({favorites.length})
        </button>
        <button
          className={`tab ${activeTab === "playlists" ? "active" : ""}`}
          onClick={() => setActiveTab("playlists")}
        >
          Playlists ({playlists.length})
        </button>
        <button
          className={`tab ${activeTab === "artists" ? "active" : ""}`}
          onClick={() => setActiveTab("artists")}
        >
          Artists
        </button>
        <button
          className={`tab ${activeTab === "albums" ? "active" : ""}`}
          onClick={() => setActiveTab("albums")}
        >
          Albums
        </button>
      </div>

      {/* Favorites Tab */}
      {activeTab === "favorites" && (
        <div className="library-content">
          {favorites.length > 0 ? (
            <div className="library-grid">
              {favorites.map((song) => (
                <div
                  key={song.id}
                  className="library-card"
                  onClick={() => handlePlaySong(song)}
                >
                  <div className="card-image">
                    <img
                      src={
                        song.album?.cover_medium ||
                        "https://via.placeholder.com/200"
                      }
                      alt={song.title}
                    />
                    <div className="card-overlay">
                      <button className="play-btn">▶</button>
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="song-info">
                      <h3>{song.title}</h3>
                      <p>{song.artist?.name}</p>
                    </div>
                    <button
                      className={`favorite-btn ${
                        isFavorite(song.id) ? "active" : ""
                      }`}
                      onClick={(e) => handleToggleFavorite(e, song)}
                      title={
                        isFavorite(song.id)
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      ♥
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-icon">♡</p>
              <p className="empty-message">No favorite songs yet</p>
              <p className="empty-subtitle">
                Add songs to your favorites to see them here
              </p>
            </div>
          )}
        </div>
      )}

      {/* Playlists Tab */}
      {activeTab === "playlists" && (
        <div className="library-content">
          {playlists.length > 0 ? (
            <div className="library-grid">
              {playlists.map((playlist) => (
                <div key={playlist.id} className="library-card">
                  <div className="card-image">
                    <div className="playlist-thumbnail">
                      {playlist.songs.slice(0, 4).map((song, idx) => (
                        <div
                          key={idx}
                          className="thumbnail-item"
                          style={{
                            backgroundImage: `url(${
                              song.album?.cover_small ||
                              "https://via.placeholder.com/50"
                            })`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="song-info">
                      <h3>{playlist.name}</h3>
                      <p>{playlist.songs.length} songs</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-icon">📋</p>
              <p className="empty-message">No playlists yet</p>
              <p className="empty-subtitle">
                Create a playlist to organize your favorite songs
              </p>
            </div>
          )}
        </div>
      )}

      {/* Artists Tab */}
      {activeTab === "artists" && (
        <div className="empty-state">
          <p className="empty-icon">🎤</p>
          <p className="empty-message">Artists feature coming soon</p>
        </div>
      )}

      {/* Albums Tab */}
      {activeTab === "albums" && (
        <div className="empty-state">
          <p className="empty-icon">💿</p>
          <p className="empty-message">Albums feature coming soon</p>
        </div>
      )}
    </div>
  );
};

export default Library;
