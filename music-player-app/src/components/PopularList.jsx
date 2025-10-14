import React, { useEffect, useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import "./PopularList.css";

const PopularList = () => {
  const [songs, setSongs] = useState([]);
  const { playSong, currentSong, isPlaying } = usePlayer();

  useEffect(() => {
    fetch("http://localhost:5000/api/popular")
      .then((response) => response.json())
      .then((data) => setSongs(data.data || []))
      .catch((error) => console.error("Error fetching popular songs:", error));
  }, []);

  const handleSongClick = (song, index) => {
    playSong(song, songs, index);
  };

  return (
    <div className="popular-list">
      <h2>Popular Songs</h2>
      <div className="song-grid">
        {songs.map((song, index) => (
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
              <div className="playing-indicator">{isPlaying ? "🔊" : "⏸️"}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularList;
