import React from "react";
import Login from "./Login";
import Register from "./Register";

function Inbox() {
  // Show only login and registration for now
  // You can add logic to toggle between them if needed
  return (
    <div className="container mt-5">
      <Login />
      {/* <Register /> Uncomment to show registration instead of login */}
    </div>
  );
}

export default Inbox;
