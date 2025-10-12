import React from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

const SearchBar = () => {
  return (
    <div className="search-bar">
      <FaSearch className="search-icon" />
      <input type="text" placeholder="Search" className="Search-input" />
    </div>
  );
};

export default SearchBar;
