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
  const playPromiseRef = useRef(null);

  // Play a single song or song with playlist
  const playSong = async (song, newPlaylist = null, index = 0) => {
    if (newPlaylist) {
      setPlaylist(newPlaylist);
      setCurrentIndex(index);
    }

    // Wait for any pending play promise to resolve
    if (playPromiseRef.current) {
      try {
        await playPromiseRef.current;
      } catch (e) {
        // Ignore errors from previous play attempts
      }
    }

    // Pause current audio
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Small delay to allow cleanup
    await new Promise((resolve) => setTimeout(resolve, 50));

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
    playSong(playlist[nextIndex], null, nextIndex);
  };

  // Play previous song in playlist
  const playPrev = () => {
    if (playlist.length === 0) return;
    const prevIndex =
      currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    playSong(playlist[prevIndex], null, prevIndex);
  };

  // Handle play/pause when state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.volume = volume;

    if (isPlaying) {
      // Reset audio source if song changed
      if (audio.src !== currentSong.preview) {
        audio.src = currentSong.preview;
        audio.load();
      }

      // Store play promise to handle interruptions
      playPromiseRef.current = audio.play();

      playPromiseRef.current
        .then(() => {
          playPromiseRef.current = null;
        })
        .catch((error) => {
          // Ignore AbortError - it happens when switching songs quickly
          if (error.name !== "AbortError") {
            console.error("Error playing audio:", error);
          }
          setIsPlaying(false);
          playPromiseRef.current = null;
        });
    } else {
      audio.pause();
      playPromiseRef.current = null;
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
      if (playlist.length > 0) {
        playNext();
      } else {
        setIsPlaying(false);
        setProgress(0);
      }
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
      <audio ref={audioRef} />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
export { PlayerContext, PlayerProvider };
