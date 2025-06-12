import React, { useState, useEffect } from "react";

function Header() {

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Apply or remove the dark-mode class on <body>
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <div className="d-flex justify-content-between align-items-center px-4 py-2 border-bottom bg-white">
      <h5 className="m-0">📧 Gmailish</h5>

      {/* Search bar (not yet connected) */}
      <input
        type="text"
        className="form-control w-50"
        placeholder="Search mail"
      />
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`btn btn-sm ${darkMode ? "btn-outline-light" : "btn-outline-secondary"}`}
      >
        {darkMode ? "🌓 Dark Mode" : "🌓 Light Mode"}
      </button>
      {/* Default profile image (placeholder) */}
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
