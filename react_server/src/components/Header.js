import React from "react";

function Header() {
  return (
    <div className="d-flex justify-content-between align-items-center px-4 py-2 border-bottom bg-white">
      <h5 className="m-0">📧 Gmailish</h5>
      <input
        type="text"
        className="form-control w-50"
        placeholder="Search mail"
      />
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
