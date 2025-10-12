// Sidebar.jsx
import React from "react";
import { AiFillHome } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { MdLibraryMusic } from "react-icons/md";
import { BsShop } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <MdLibraryMusic size={32} color="#ec4899" />
        <span className="logo-text">Music App</span>
      </div>

      <nav className="nav">
        <div className="nav-section">
          <h3 className="nav-title">Library</h3>

          <a href="#" className="nav-link nav-link-active">
            <AiFillHome size={20} />
            <span>Home</span>
          </a>

          <a href="#" className="nav-link">
            <BiSearch size={20} />
            <span>Search</span>
          </a>

          <a href="#" className="nav-link">
            <MdLibraryMusic size={20} />
            <span>Library</span>
          </a>
        </div>

        <div className="nav-section">
          <h3 className="nav-title">Discover</h3>

          <a href="#" className="nav-link">
            <BsShop size={20} />
            <span>Store</span>
          </a>

          <a href="#" className="nav-link">
            <AiFillHeart size={20} />
            <span>Favorite</span>
          </a>

          <a href="#" className="nav-link">
            <FaUser size={20} />
            <span>Profile</span>
          </a>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
