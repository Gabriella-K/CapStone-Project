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
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import Library from "./pages/Library";
import TopBar from "./components/TopBar";
import Recommendations from "./components/Recommendations";
function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <header className="header"></header>
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
                      <TopBar />
                    </>
                  }
                />
                <Route path="/search" element={<Search />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/Library" element={<Library />} />
              </Routes>
            </div>
            <PlayerControls />
          </PlayerProvider>
        </div>
        <Recommendations />
      </div>
    </AuthProvider>
  );
}

export default App;
