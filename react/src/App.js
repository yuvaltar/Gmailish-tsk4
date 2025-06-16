// react/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login        from "./pages/Login";
import Register     from "./pages/Register";
import Inbox        from "./pages/Inbox";
import SpamList     from "./components/SpamList";
import Search       from "./pages/Search";
import Compose      from "./pages/Compose";
import LabelPage    from "./pages/LabelPage";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/"        element={<Login />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/register"element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/spam"
          element={
            <ProtectedRoute>
              <SpamList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/send"
          element={
            <ProtectedRoute>
              <Compose />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/label/:labelName"
          element={
            <ProtectedRoute>
              <LabelPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
