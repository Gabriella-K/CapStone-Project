import { useState } from "react";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import TrendingSlider from "./components/TrendingSlider";
import PopularList from "./components/PopularList";
import PlayerControls from "./components/PlayerControls";
import "./App.css";
import { PlayerProvider } from "./context/PlayerContext";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <header className="header">
          <SearchBar />
        </header>
        <PlayerProvider>
          <div className="content">
            <h2 className="section-title">Trending</h2>
            <TrendingSlider />
            <PopularList />
            <PlayerControls />
          </div>
        </PlayerProvider>
      </div>
    </div>
  );
}

export default App;
