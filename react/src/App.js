// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import Compose from "./pages/Compose";
import LabelPage from "./pages/LabelPage";
import EmailPage from "./pages/EmailPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated routes share the Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Default: Inbox */}
          <Route index element={<EmailPage />} />

          {/* Compose & Search */}
          <Route path="send" element={<Compose />} />
          <Route path="search" element={<Search />} />

          {/* Custom labels: /label/Work, /label/Spam, etc. */}
          <Route path="label/:labelName" element={<LabelPage />} />

          {/* Built-in folders: /inbox, /sent, /starred, etc. */}
          <Route path=":labelName" element={<EmailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
