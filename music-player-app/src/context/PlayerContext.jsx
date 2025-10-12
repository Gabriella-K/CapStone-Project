import React, { createContext, useState, useRef } from "react";

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  const PlaySong = (song) => {
    if (!song || !song.preview) return;
    if (currentSong?.id !== song.id) {
      audioRef.current.src = song.preview;
      audioRef.current.play();
      setCurrentSong(song);
      setIsPlaying(true);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) pauseSong();
    else audioRef.current.play() && setIsPlaying(true);
  };
  const stopSong = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentSong(null);
  };
  <PlayerContext.Provider
    value={{
      currentSong,
      isPlaying,
      PlaySong,
      pauseSong,
      togglePlay,
      stopSong,
    }}
  >
    {children}
  </PlayerContext.Provider>;
};
