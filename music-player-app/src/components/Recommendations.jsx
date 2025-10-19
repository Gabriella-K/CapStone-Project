import React, { useState, useEffect } from "react";
import { usePlayer } from "../context/PlayerContext";
import { useFavorites } from "../context/FavoriteContext";
import { FaPlay, FaHeart } from "react-icons/fa";
import "./Recommendations.css";

const Recommendations = () => {
  const { playSong } = usePlayer();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/popular");
      const data = await response.json();
      // Get first 5 songs as recommendations
      setRecommendations(data.data?.slice(0, 5) || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = (song) => {
    if (song && song.preview) {
      playSong(song);
    }
  };

  const handleToggleFavorite = (e, song) => {
    e.stopPropagation();
    toggleFavorite(song);
  };

  if (loading) {
    return (
      <div className="recommendations-sidebar">
        <h3 className="recommendations-title">Recommended For You</h3>
        <div className="loading-spinner">Loading recommendations...</div>
      </div>
    );
  }

  return (
    <div className="recommendations-sidebar">
      <h3 className="recommendations-title">Recommended For You</h3>

      {recommendations.length > 0 ? (
        <div className="recommendations-list">
          {recommendations.map((song) => (
            <div
              key={song.id}
              className="recommendation-item"
              onClick={() => handlePlaySong(song)}
            >
              <div className="recommendation-img">
                <img
                  src={
                    song.album?.cover_small || "https://via.placeholder.com/50"
                  }
                  alt={song.title}
                />
                <button className="recommendation-play-btn">
                  <FaPlay />
                </button>
              </div>

              <div className="recommendation-info">
                <p className="recommendation-title">{song.title}</p>
                <p className="recommendation-artist">{song.artist?.name}</p>
              </div>

              <button
                className={`recommendation-favorite ${
                  isFavorite(song.id) ? "active" : ""
                }`}
                onClick={(e) => handleToggleFavorite(e, song)}
              >
                <FaHeart />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-recommendations">
          <p>No recommendations available</p>
        </div>
      )}

      <button className="see-more-btn" onClick={fetchRecommendations}>
        ↻ Refresh Recommendations
      </button>
    </div>
  );
};

export default Recommendations;
