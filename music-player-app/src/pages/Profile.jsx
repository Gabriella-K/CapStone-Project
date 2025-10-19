import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoriteContext";
import { FaUser, FaEnvelope, FaHeart, FaMusic } from "react-icons/fa";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();
  const { favorites, getPlaylists } = useFavorites();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const userPlaylists = getPlaylists();
    setPlaylists(userPlaylists);
  }, []);

  if (loading) {
    return (
      <div className="profile-page">
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const userInitial = user.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">{userInitial}</div>
        <div className="profile-details">
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-email">{user.email}</p>
          <p className="profile-joined">
            Member since {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaHeart />
          </div>
          <div className="stat-content">
            <p className="stat-number">{favorites.length}</p>
            <p className="stat-label">Favorite Songs</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaMusic />
          </div>
          <div className="stat-content">
            <p className="stat-number">{playlists.length}</p>
            <p className="stat-label">Playlists</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaUser />
          </div>
          <div className="stat-content">
            <p className="stat-number">1</p>
            <p className="stat-label">Profile</p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="account-section">
        <h2>Account Information</h2>
        <div className="account-info">
          <div className="info-item">
            <span className="info-label">
              <FaUser /> Full Name
            </span>
            <span className="info-value">{user.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">
              <FaEnvelope /> Email
            </span>
            <span className="info-value">{user.email}</span>
          </div>
        </div>
      </div>

      {/* Favorites Preview */}
      {favorites.length > 0 && (
        <div className="favorites-section">
          <h2>Your Favorite Songs</h2>
          <div className="favorites-preview">
            {favorites.slice(0, 4).map((song) => (
              <div key={song.id} className="favorite-card">
                <img
                  src={
                    song.album?.cover_medium ||
                    "https://via.placeholder.com/100"
                  }
                  alt={song.title}
                />
                <div className="favorite-info">
                  <p className="favorite-title">{song.title}</p>
                  <p className="favorite-artist">{song.artist?.name}</p>
                </div>
              </div>
            ))}
          </div>
          {favorites.length > 4 && (
            <button
              className="view-all-btn"
              onClick={() => navigate("/library")}
            >
              View All {favorites.length} Favorites
            </button>
          )}
        </div>
      )}

      {/* Playlists Preview */}
      {playlists.length > 0 && (
        <div className="playlists-section">
          <h2>Your Playlists</h2>
          <div className="playlists-preview">
            {playlists.slice(0, 4).map((playlist) => (
              <div key={playlist.id} className="playlist-card">
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
                <div className="playlist-info">
                  <p className="playlist-name">{playlist.name}</p>
                  <p className="playlist-count">
                    {playlist.songs.length} songs
                  </p>
                </div>
              </div>
            ))}
          </div>
          {playlists.length > 4 && (
            <button
              className="view-all-btn"
              onClick={() => navigate("/library")}
            >
              View All {playlists.length} Playlists
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
