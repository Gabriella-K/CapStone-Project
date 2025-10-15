import { useState } from "react";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import TrendingSlider from "./components/TrendingSlider";
import PopularList from "./components/PopularList";
import PlayerControls from "./components/PlayerControls";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { PlayerProvider } from "./context/PlayerContext";
import Search from "./pages/Search";

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
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <h2 className="section-title">Trending</h2>
                    <TrendingSlider />
                    <PopularList />
                  </>
                }
              />
              <Route path="/search" element={<Search />} />
            </Routes>
          </div>
          <PlayerControls />
        </PlayerProvider>
      </div>
    </div>
  );
}

export default App;
