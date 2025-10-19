import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaMoon,
  FaSun,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
import "./TopBar.css";

const TopBar = ({ theme, toggleTheme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to Music App!", read: false },
  ]);
  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setShowSearchResults(true);
    setLoadingSearch(true);

    try {
      // Search for popular songs and filter by query
      const response = await fetch("http://localhost:5000/api/popular");
      const data = await response.json();

      const filtered =
        data.data
          ?.filter(
            (song) =>
              song.title.toLowerCase().includes(query.toLowerCase()) ||
              song.artist?.name.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5) || [];

      setSearchResults(filtered);
    } catch (error) {
      console.error("Error searching songs:", error);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSearchResults(false);
    }
  };

  const handleSongClick = (song) => {
    navigate(`/search?song=${song.id}`);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowProfileMenu(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setShowProfileMenu(false);
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className={`topbar ${theme}`}>
      {/* Left Section - Logo */}
      <div className="topbar-left">
        <div className="logo">
          <span className="logo-icon"></span>
          <span className="logo-text"></span>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="topbar-center" ref={searchRef}>
        <form className="search-box" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() =>
              searchQuery.trim().length >= 2 && setShowSearchResults(true)
            }
          />
          <span className="search-icon">🔍</span>
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <div className="search-results-dropdown">
            {loadingSearch ? (
              <div className="search-loading">Searching...</div>
            ) : searchResults.length > 0 ? (
              <div className="search-results-list">
                {searchResults.map((song) => (
                  <div
                    key={song.id}
                    className="search-result-item"
                    onClick={() => handleSongClick(song)}
                  >
                    <img
                      src={
                        song.album?.cover_small ||
                        "https://via.placeholder.com/40"
                      }
                      alt={song.title}
                      className="result-thumbnail"
                    />
                    <div className="result-info">
                      <p className="result-title">{song.title}</p>
                      <p className="result-artist">{song.artist?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="search-empty">No songs found</div>
            )}
          </div>
        )}
      </div>

      {/* Right Section - Icons */}
      <div className="topbar-right">
        {/* Theme Toggle */}
        <button
          className="topbar-icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>

        {/* Notifications */}
        <div className="notification-container" ref={notificationRef}>
          <button
            className="topbar-icon-btn notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />
            {unreadNotifications > 0 && (
              <span className="notification-badge">{unreadNotifications}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-panel">
              <div className="notification-header">
                <h3>Notifications</h3>
                {notifications.length > 0 && (
                  <button className="clear-btn" onClick={clearNotifications}>
                    Clear All
                  </button>
                )}
              </div>
              <div className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`notification-item ${
                        notif.read ? "read" : "unread"
                      }`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <div className="notif-dot"></div>
                      <p>{notif.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-notifications">No notifications</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="profile-container" ref={profileMenuRef}>
          <button
            className="topbar-icon-btn profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            title={user?.name}
          >
            <FaUser />
          </button>

          {showProfileMenu && (
            <div className="profile-menu">
              <div className="profile-header">
                <div className="profile-avatar">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="profile-info">
                  <p className="profile-name">{user?.name}</p>
                  <p className="profile-email">{user?.email}</p>
                </div>
              </div>

              <div className="profile-menu-items">
                <button
                  className="profile-menu-item"
                  onClick={handleProfileClick}
                >
                  <FaUser /> My Profile
                </button>
                <button className="profile-menu-item">
                  <FaCog /> Settings
                </button>
              </div>

              <div className="profile-menu-footer">
                <button
                  className="profile-menu-item logout-btn"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
