import React from "react";
import { AiFillHome } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { MdLibraryMusic } from "react-icons/md";
import { BsShop } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
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

          <Link to="/" className="nav-link nav-link-active">
            <AiFillHome size={20} />
            <span>Home</span>
          </Link>

          <Link to="/search" className="nav-link search-link">
            <BiSearch size={20} />
            <span>Search</span>
          </Link>

          <Link to="/library" className="nav-link">
            <MdLibraryMusic size={20} />
            <span>Library</span>
          </Link>
        </div>

        <div className="nav-section">
          <h3 className="nav-title">Discover</h3>

          <Link to="/store" className="nav-link">
            <BsShop size={20} />
            <span>Store</span>
          </Link>

          <Link to="/favorite" className="nav-link">
            <AiFillHeart size={20} />
            <span>Favorite</span>
          </Link>

          <Link to="/profile" className="nav-link">
            <FaUser size={20} />
            <span>Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
