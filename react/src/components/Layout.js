// Layout.js
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Compose from "../pages/Compose";
import "./Layout.css";

export default function Layout() {
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <div className={`container-fluid vh-100 d-flex flex-column p-0${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <Header
        setSearchQuery={setSearchQuery}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div className="layout-wrapper">
        <Sidebar
          onComposeClick={() => setShowCompose(true)}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* NEW: route-surface gives the full-bleed indigo bg on list pages */}
        <div className="route-surface">
          <div className="email-list-container">
            <Outlet context={{ searchQuery, sidebarCollapsed, darkMode }} />
          </div>
        </div>
      </div>

      {showCompose && <Compose onClose={() => setShowCompose(false)} />}
    </div>
  );
}
