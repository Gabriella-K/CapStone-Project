import React, { useEffect, useState } from "react";
import "./PopularList.css";

const PopularList = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/popular")
      .then((response) => response.json())
      .then((data) => setSongs(data.data || []))
      .catch((error) => console.error("Error fetching popular songs:", error));
  }, []);

  return (
    <div className="popular-list">
      <h2>Popular Songs</h2>
      <div className="song-grid">
        {songs.map((song) => (
          <div key={song.id} className="song-card">
            <img src={song.album.cover_medium} alt={song.title} />
            <div className="song-info">
              <p className="song-title">{song.title}</p>
              <p className="artist">{song.artist.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularList;
