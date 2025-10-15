import React, { useEffect, useState, useRef } from "react";
import "./Search.css";

const Search = () => {
  const [genres, setGenres] = useState([]);
  const [songs, setSongs] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

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

  // Handle play/pause song
  const handlePlaySong = (song) => {
    if (currentSong?.id === song.id && isPlaying) {
      // Pause current song
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Play new song or resume
      setCurrentSong(song);
      if (audioRef.current) {
        audioRef.current.src = song.preview;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Handle audio end
  const handleAudioEnd = () => {
    setIsPlaying(false);
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
                <div key={song.id} className="song-card">
                  <div className="song-image-container">
                    <img
                      src={song.album.cover_medium}
                      alt={song.title}
                      className="song-img"
                    />
                    <button
                      className="play-button"
                      onClick={() => handlePlaySong(song)}
                    >
                      {currentSong?.id === song.id && isPlaying ? (
                        <span>⏸</span>
                      ) : (
                        <span>▶</span>
                      )}
                    </button>
                  </div>
                  <p className="song-title">{song.title}</p>
                  <p className="artist-name">{song.artist.name}</p>
                </div>
              ))
            ) : (
              <p className="loading">No songs found for this genre.</p>
            )}
          </div>
        </>
      )}

      {/* Audio player (hidden) */}
      <audio ref={audioRef} onEnded={handleAudioEnd} />

      {/* Now Playing Bar */}
      {currentSong && (
        <div className="now-playing-bar">
          <img
            src={currentSong.album.cover_small}
            alt={currentSong.title}
            className="now-playing-img"
          />
          <div className="now-playing-info">
            <p className="now-playing-title">{currentSong.title}</p>
            <p className="now-playing-artist">{currentSong.artist.name}</p>
          </div>
          <button
            className="control-button"
            onClick={() => handlePlaySong(currentSong)}
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;
