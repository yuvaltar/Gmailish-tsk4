import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inbox from "./pages/Inbox";
import Search from "./pages/Search";
import Compose from "./pages/Compose";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ This line now dynamically checks token every render */}
        <Route
          path="/"
          element={
            <Navigate
              to={localStorage.getItem("token") ? "/inbox" : "/login"}
              replace
            />
          }
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
      </Routes>
    </Router>
  );
}

export default App;
