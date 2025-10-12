import { useState } from "react";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import TrendingSlider from "./components/TrendingSlider";
import PopularList from "./components/PopularList";
import { PlayerProvider } from "./context/PlayerContext";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <header className="header">
          <SearchBar />
        </header>
        <div className="content">
          <h2 className="section-title">Trending</h2>
          <TrendingSlider />
          <PopularList />
          <PlayerProvider />
        </div>
      </div>
    </div>
  );
}

export default App;
