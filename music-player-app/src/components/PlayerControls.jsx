import React from "react";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaVolumeUp,
} from "react-icons/fa";
import { usePlayer } from "../context/PlayerContext";
import "./PlayerControls.css";

const PlayerControls = () => {
  const {
    currentSong,
    isPlaying,
    progress,
    volume,
    togglePlay,
    playNext,
    playPrev,
    handleSeek,
    setVolume,
    duration,
  } = usePlayer();

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentSong) {
    return (
      <div className="player-controls empty">
        <p className="no-song">Select a song to start playing</p>
      </div>
    );
  }

  return (
    <div className="player-controls">
      {/* Left Section - Song Info */}
      <div className="song-info">
        <img
          src={
            currentSong.album?.cover_small || currentSong.album?.cover_medium
          }
          alt={currentSong.title}
          className="song-cover"
        />
        <div className="song-text">
          <p className="song-title">{currentSong.title}</p>
          <p className="artist-name">{currentSong.artist?.name}</p>
        </div>
      </div>

      {/* Center Section - Controls & Progress */}
      <div className="controls-center">
        <div className="controls">
          <FaStepBackward className="icon" onClick={playPrev} />
          {isPlaying ? (
            <FaPause className="icon play-pause" onClick={togglePlay} />
          ) : (
            <FaPlay className="icon play-pause" onClick={togglePlay} />
          )}
          <FaStepForward className="icon" onClick={playNext} />
        </div>

        <div className="progress-bar-container">
          <span className="time">
            {formatTime((progress / 100) * duration)}
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => handleSeek(e.target.value)}
            className="progress-bar"
            style={{
              background: `linear-gradient(to right, #ff5c8d 0%, #ff5c8d ${progress}%, #4d4d4d ${progress}%, #4d4d4d 100%)`,
            }}
          />
          <span className="time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right Section - Volume */}
      <div className="volume-control">
        <FaVolumeUp className="icon" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume * 100}
          onChange={(e) => setVolume(e.target.value / 100)}
          className="volume-bar"
          style={{
            background: `linear-gradient(to right, #ff5c8d 0%, #ff5c8d ${
              volume * 100
            }%, #4d4d4d ${volume * 100}%, #4d4d4d 100%)`,
          }}
        />
      </div>
    </div>
  );
};

export default PlayerControls;
