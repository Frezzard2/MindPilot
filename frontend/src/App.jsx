import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FiBookOpen, FiClock } from "react-icons/fi";
import MainPage from "./pages/MainPage";
import History from "./pages/History";
import LearningStyleQuiz from "./pages/LearningStyleQuiz";

function App() {
  const [learningProfile, setLearningProfile] = useState(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem("learningProfile");
    if (storedProfile) {
      setLearningProfile(JSON.parse(storedProfile));
    }
  }, []);

  const handleQuizComplete = (profile) => {
    setLearningProfile(profile.type);
  };

  return (
    <Router>
      <div style={{ maxWidth: "800px", margin: "auto", padding: "2rem" }}>
        {!learningProfile ? (
          <LearningStyleQuiz onComplete={handleQuizComplete} />
        ) : (
          <>
            <nav style={{ marginBottom: "2rem", display: "flex", gap: "1rem", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Link to="/" style={{ textDecoration: "none", color: "#4f46e5", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiBookOpen /> Main
                </Link>
                <Link to="/history" style={{ textDecoration: "none", color: "#4f46e5", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiClock /> History
                </Link>
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem("learningProfile");
                  setLearningProfile(null);
                }}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.875rem"
                }}
              >
                Reset Profile
              </button>
            </nav>

            <Routes>
              <Route path="/" element={<MainPage learningProfile={learningProfile} />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;