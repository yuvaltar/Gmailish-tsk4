import React, { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import './Header.css';

function Header({ onSearch }) {
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      onSearch(query);
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center px-4 py-2 border-bottom bg-white">
      <h5 className="m-0">📧 Gmailish</h5>

      {/* Gmail-style search bar */}
      <div className="search-bar-container position-relative w-50 me-3">
        <button
          className="search-icon-btn"
          onClick={() => onSearch(query)}
          type="button"
        >
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

      <img
        src="https://www.gravatar.com/avatar?d=mp"
        alt="Profile"
        className="rounded-circle ms-3"
        style={{ width: "32px", height: "32px" }}
      />
    </div>
  );
}

export default Header;
