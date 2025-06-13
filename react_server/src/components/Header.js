import React from "react";
import { useNavigate } from "react-router-dom";

function Header({ onSearch }) {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div className="d-flex justify-content-between align-items-center px-4 py-2 border-bottom bg-white">
      <h5 className="m-0" style={{ cursor: "pointer" }} onClick={() => navigate("/inbox")}>
        📧 Gmailish
      </h5>
      {/* Search bar (optional callback) */}
      <input
        type="text"
        className="form-control w-50"
        placeholder="Search mail"
        onChange={handleSearch}
      />
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
