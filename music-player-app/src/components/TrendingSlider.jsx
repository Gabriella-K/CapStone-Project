import React, { useEffect, useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { usePlayer } from "../context/PlayerContext";
import "./TrendingSlider.css";

const TrendingSlider = () => {
  const [artists, setArtists] = useState([]);
  const sliderRef = useRef(null);
  const { playSong } = usePlayer();

  useEffect(() => {
    fetch("http://localhost:5000/api/trending")
      .then((response) => response.json())
      .then((data) => {
        if (data && data.artists && data.artists.data) {
          setArtists(data.artists.data);
        }
      })
      .catch((error) => console.error("Error fetching artists:", error));
  }, []);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  // Fetch artist's top track and play it
  const handleArtistClick = async (artist) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/artist/${artist.id}/top`
      );
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        const topTracks = data.data;
        playSong(topTracks[0], topTracks, 0); // Play first track with full playlist
      } else {
        console.warn("No tracks found for artist:", artist.name);
      }
    } catch (error) {
      console.error("Error fetching artist tracks:", error);
    }
  };

  return (
    <div className="trending-slider">
      <h2>Trending Artists</h2>
      <div className="slider-wrapper">
        <FaChevronLeft className="slide-btn left" onClick={scrollLeft} />
        <div className="slider-container" ref={sliderRef}>
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="artist-card"
              onClick={() => handleArtistClick(artist)}
            >
              <img
                src={artist.picture_medium}
                alt={artist.name}
                className="artist-img"
              />
              <p className="artist-name">{artist.name}</p>
            </div>
          ))}
        </div>
        <FaChevronRight className="slide-btn right" onClick={scrollRight} />
      </div>
    </div>
  );
};

export default TrendingSlider;
