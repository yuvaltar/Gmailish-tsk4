// Router listens to url changes, routes - container for all routes, route a route 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inbox from "./pages/Inbox";
import Search from "./pages/Search";
import Compose from './pages/Compose';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/send" element={<Compose />} />
        <Route path="/search" element={<Search />} /> 
      </Routes>
    </Router>
  );
}

export default App;
