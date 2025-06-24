import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FiBookOpen, FiClock } from "react-icons/fi";
import MainPage from "./pages/MainPage";
import History from "./pages/History";

function App() {
  return (
    <Router>
      <div style={{ maxWidth: "800px", margin: "auto", padding: "2rem" }}>
        <nav style={{ marginBottom: "2rem", display: "flex", gap: "1rem" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#4f46e5", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiBookOpen /> Main
          </Link>
          <Link to="/history" style={{ textDecoration: "none", color: "#4f46e5", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiClock /> History
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;