import React, { useEffect, useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import { useFavorites } from "../context/FavoriteContext";
import "./Search.css";

const Search = () => {
  const [genres, setGenres] = useState([]);
  const [songs, setSongs] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const { currentSong, isPlaying, playSong } = usePlayer();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Fetch genres on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/genres")
      .then((response) => response.json())
      .then((data) => {
        setGenres(data.data);
      })
      .catch((error) => console.error("Error fetching genres:", error));
  }, []);

  // Handle click on genre
  const handleGenreClick = async (genre) => {
    setSelectedGenre(genre.name);
    try {
      const response = await fetch(
        `http://localhost:5000/api/genres/${genre.id}`
      );
      const data = await response.json();
      setSongs(data.data || []);
    } catch (error) {
      console.error("Error fetching genre songs:", error);
    }
  };

  // Handle play song using PlayerContext
  const handlePlaySong = (song) => {
    if (song && song.preview) {
      playSong(song, songs);
    }
  };

  // Handle favorite toggle
  const handleToggleFavorite = (e, song) => {
    e.stopPropagation();
    toggleFavorite(song);
  };

  return (
    <div className="search-page">
      <h2>Explore Genres</h2>
      <div className="genre-grid">
        {genres.map((genre) => (
          <div
            key={genre.id}
            className="genre-card"
            onClick={() => handleGenreClick(genre)}
          >
            <img src={genre.picture_medium} alt={genre.name} />
            <p>{genre.name}</p>
          </div>
        ))}
      </div>

      {selectedGenre && (
        <>
          <h3 className="genre-title">{selectedGenre} Songs</h3>
          <div className="song-grid">
            {songs.length > 0 ? (
              songs.map((song) => (
                <div
                  key={song.id}
                  className="song-card"
                  onClick={() => handlePlaySong(song)}
                >
                  <div className="song-image-container">
                    <img
                      src={song.album?.cover_medium}
                      alt={song.title}
                      className="song-img"
                    />
                    <div className="card-overlay">
                      <button
                        className="play-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySong(song);
                        }}
                      >
                        {currentSong?.id === song.id && isPlaying ? (
                          <span>⏸</span>
                        ) : (
                          <span>▶</span>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="song-card-footer">
                    <div className="song-card-info">
                      <p className="song-title">{song.title}</p>
                      <p className="artist-name">{song.artist?.name}</p>
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
              ))
            ) : (
              <p className="loading">No songs found for this genre.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
