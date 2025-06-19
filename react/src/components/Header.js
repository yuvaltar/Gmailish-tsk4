import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import "./Header.css";

function Header({ setSearchQuery }) {
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    fetch("http://localhost:3000/api/tokens/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("User fetch error", err));
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const performSearch = () => {
    setSearchQuery(query.trim());
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  const gmailishEmail = user?.username ? `${user.username}@gmailish.com` : "";

  return (
    <div className="d-flex justify-content-between align-items-center px-4 py-2 border-bottom bg-white">
      <h5
        className="m-0"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/inbox")}
        title="Go to Inbox"
      >
        📧 Gmailish
      </h5>

      <div className="search-bar-container position-relative w-50 me-3">
        <button className="search-icon-btn" onClick={performSearch} type="button">
          <BsSearch />
        </button>
        <input
          type="text"
          className="form-control ps-5"
          placeholder="Search mail"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`btn btn-sm ${darkMode ? "btn-outline-light" : "btn-outline-secondary"}`}
      >
        {darkMode ? "🌓 Dark Mode" : "🌓 Light Mode"}
      </button>

      <div className="position-relative ms-3" ref={menuRef} style={{ display: "inline-block" }}>
        <img
          src={
            user?.picture
              ? `http://localhost:3000/uploads/${user.picture}`
              : "https://www.gravatar.com/avatar?d=mp"
          }
          alt="Profile"
          className="rounded-circle"
          style={{ width: "32px", height: "32px", cursor: "pointer" }}
          onClick={() => setShowMenu((show) => !show)}
        />
        {showMenu && (
          <div
            className="dropdown-menu show"
            style={{
              position: "absolute",
              right: 0,
              top: "110%",
              minWidth: "180px",
              zIndex: 1000,
            }}
          >
            <div className="dropdown-item-text text-muted small">{gmailishEmail}</div>
            <button
              className="dropdown-item"
              onClick={() => {
                setShowMenu(false);
                navigate("/register");
              }}
            >
              Register
            </button>
            <button className="dropdown-item" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
