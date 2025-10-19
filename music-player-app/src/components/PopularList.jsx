import React, { useEffect, useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { usePlayer } from "../context/PlayerContext";
import "./PopularList.css";

const PopularList = () => {
  const [songs, setSongs] = useState([]);
  const { playSong, currentSong, isPlaying } = usePlayer();
  const sliderRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/popular")
      .then((response) => response.json())
      .then((data) => setSongs(data.data || []))
      .catch((error) => console.error("Error fetching popular songs:", error));
  }, []);

  const handleSongClick = (song, index) => {
    playSong(song, songs, index);
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="popular-list">
      <h2>Popular Songs</h2>
      <div className="slider-wrapper">
        <FaChevronLeft
          className="slide-btn left"
          onClick={scrollLeft}
          aria-label="Scroll left"
        />
        <div className="slider-container" ref={sliderRef}>
          {songs.length > 0 ? (
            songs.map((song, index) => (
              <div
                key={song.id}
                className={`song-card ${
                  currentSong?.id === song.id ? "active" : ""
                }`}
                onClick={() => handleSongClick(song, index)}
              >
                <img src={song.album.cover_medium} alt={song.title} />
                <div className="song-info">
                  <p className="song-title">{song.title}</p>
                  <p className="artist">{song.artist.name}</p>
                </div>
                {currentSong?.id === song.id && (
                  <div className="playing-indicator">
                    {isPlaying ? "🔊" : "⏸️"}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="loading-text">Loading songs...</div>
          )}
        </div>
        <FaChevronRight
          className="slide-btn right"
          onClick={scrollRight}
          aria-label="Scroll right"
        />
      </div>
    </div>
  );
};

export default PopularList;
