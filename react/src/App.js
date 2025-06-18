// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
<<<<<<< itay
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inbox from "./pages/Inbox";
import Search from "./pages/Search";
import Compose from "./pages/Compose";
import LabelPage from "./pages/LabelPage";
import Draft from "./pages/Draft";
import Sent from "./pages/Sent";
import Starred from "./pages/Starred";
import ProtectedRoute from "./utils/ProtectedRoute"; // Use your utils/ProtectedRoute
=======

import Login          from "./pages/Login";
import Register       from "./pages/Register";
import Compose        from "./pages/Compose";
import Search         from "./pages/Search";
import EmailPage      from "./pages/EmailPage";
import ProtectedRoute from "./utils/ProtectedRoute";
import Layout         from "./components/Layout";
>>>>>>> itay-yuval

function App() {
  return (
    <Router>
      <Routes>

        {/* Public */}
        <Route path="/"         element={<Login />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* All mail views share the same Layout */}
        <Route
<<<<<<< itay
          path="/sent"
          element={
            <ProtectedRoute>
              <Sent />
            </ProtectedRoute>
          }
        />
        <Route
        path="/drafts"
        element={
          <ProtectedRoute>
            <Draft />
          </ProtectedRoute>
        }
        />
        <Route
        path="/starred"
        element={
          <ProtectedRoute>
            <Starred />
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
=======
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* default = / → inbox */}
          <Route index            element={<EmailPage />} />

          {/* /spam, /starred, /MyCustomLabel, etc. */}
          <Route path=":labelName" element={<EmailPage />} />

          {/* Compose & Search */}
          <Route path="send"      element={<Compose />} />
          <Route path="search"    element={<Search />} />
        </Route>
>>>>>>> itay-yuval
      </Routes>
    </Router>
  );
}

export default App;
