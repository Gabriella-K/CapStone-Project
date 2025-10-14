import { createContext, useState, useRef, useEffect, useContext } from "react";

const PlayerContext = createContext();

const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [duration, setDuration] = useState(0);

  // Play a single song or song with playlist
  const playSong = (song, newPlaylist = null, index = 0) => {
    if (newPlaylist) {
      setPlaylist(newPlaylist);
      setCurrentIndex(index);
    }
    setCurrentSong(song);
    setIsPlaying(true);
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!currentSong) return;
    setIsPlaying((prev) => !prev);
  };

  // Play next song in playlist
  const playNext = () => {
    if (playlist.length === 0) return;
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    setCurrentSong(playlist[nextIndex]);
    setIsPlaying(true);
  };

  // Play previous song in playlist
  const playPrev = () => {
    if (playlist.length === 0) return;
    const prevIndex =
      currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentSong(playlist[prevIndex]);
    setIsPlaying(true);
  };

  // Handle play/pause when state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;

      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong, volume]);

  // Track progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, playlist]);

  // Seek to position
  const handleSeek = (value) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = (value / 100) * audio.duration;
      setProgress(value);
    }
  };

  const value = {
    audioRef,
    currentSong,
    playlist,
    currentIndex,
    isPlaying,
    progress,
    volume,
    duration,
    playSong,
    togglePlay,
    playNext,
    playPrev,
    setVolume,
    handleSeek,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} src={currentSong?.preview} />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
export { PlayerContext, PlayerProvider };
