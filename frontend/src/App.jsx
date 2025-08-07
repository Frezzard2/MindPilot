import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FiBookOpen, FiClock, FiSun, FiMoon } from "react-icons/fi";
import MainPage from "./pages/MainPage";
import History from "./pages/History";
import LearningStyleQuiz from "./pages/LearningStyleQuiz";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

function AppContent() {
  const [learningProfile, setLearningProfile] = useState(null);
  const { isDark, toggleTheme } = useTheme();

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
                <Link to="/" style={{ textDecoration: "none", color: "var(--link-color)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiBookOpen /> Main
                </Link>
                <Link to="/history" style={{ textDecoration: "none", color: "var(--link-color)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiClock /> History
                </Link>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button 
                  onClick={toggleTheme}
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? <FiSun /> : <FiMoon />}
                </button>
                <button 
                  onClick={() => {
                    localStorage.removeItem("learningProfile");
                    setLearningProfile(null);
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "var(--button-danger)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.875rem"
                  }}
                >
                  Reset Profile
                </button>
              </div>
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

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;