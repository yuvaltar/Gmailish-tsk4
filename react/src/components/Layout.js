import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Compose from "../pages/Compose";
import "./Layout.css";

export default function Layout() {
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0">
      <Header setSearchQuery={setSearchQuery} />

      <div className="flex-grow-1 d-flex overflow-hidden">
        <aside className="sidebar-fixed border-end bg-light">
          <Sidebar onComposeClick={() => setShowCompose(true)} />
        </aside>

        <main className="flex-grow-1 overflow-auto">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>

      {showCompose && <Compose onClose={() => setShowCompose(false)} />}
    </div>
  );
}
