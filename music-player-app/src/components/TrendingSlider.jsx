import React, { useEffect, useState } from "react";
import "./TrendingSlider.css";

const TrendingSlider = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/trending")
      .then((response) => response.json())
      .then((data) => {
        console.log("Deezer data:", data);
        if (data && data.artists && data.artists.data) {
          setArtists(data.artists.data);
        } else {
          console.warn("No artist data found in response");
          setArtists([]);
        }
      })
      .catch((error) => console.error("Error fetching artists:", error));
  }, []);

  return (
    <div className="Trending-Slider">
      <h2>Trending Artists</h2>
      <div className="slider-container">
        {artists.length > 0 ? (
          artists.map((artist) => (
            <div key={artist.id} className="artist-card">
              <img
                src={artist.picture_medium}
                alt={artist.name}
                className="artist-img"
              />
              <p className="artist-name">{artist.name}</p>
            </div>
          ))
        ) : (
          <p className="loading-text">Loading trending artists...</p>
        )}
      </div>
    </div>
  );
};

export default TrendingSlider;
