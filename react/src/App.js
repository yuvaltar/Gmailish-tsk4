import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inbox from "./pages/Inbox";
import Search from "./pages/Search";
import Compose from "./pages/Compose";
import LabelPage from "./pages/LabelPage"; // ✅ new import
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element= {<Login />}
        />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/inbox"
          element={
            <RequireAuth>
              <Inbox />
            </RequireAuth>
          }
        />
        <Route
          path="/send"
          element={
            <RequireAuth>
              <Compose />
            </RequireAuth>
          }
        />
        <Route
          path="/search"
          element={
            <RequireAuth>
              <Search />
            </RequireAuth>
          }
        />

        {/* ✅ New dynamic label route */}
        <Route
          path="/label/:labelName"
          element={
            <RequireAuth>
              <LabelPage />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
