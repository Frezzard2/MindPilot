import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { marked } from "marked";
import DOMPurify from "dompurify";
import {
  FiSend,
  FiBookOpen,
  FiLoader,
  FiDownload,
  FiSave,
} from "react-icons/fi";

function MainPage({ learningProfile }) {
  const subjects = [
    { id: "math", label: "Mathematics" },
    { id: "prog", label: "Programming" },
    { id: "phys", label: "Physics" },
    { id: "chem", label: "Chemistry" },
    { id: "bio", label: "Biology" },
    { id: "hist", label: "History" },
    { id: "geo", label: "Geography" },
    { id: "eng", label: "English" },
    { id: "art", label: "Art" },
    { id: "music", label: "Music" },
  ];

  const [topic, setTopic] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].id);
  const [detailLevel, setDetailLevel] = useState("normal");
  const [result, setResult] = useState("");
  const [tips, setTips] = useState([]);
  const [loadingTips, setLoadingTips] = useState(false);
  useEffect(() => {
    if (!learningProfile) return;

    const profileToDetailMap = {
      "Beginner": "simple",
      "Visual Learner": "detailed",
      "Text-Based Learner": "normal",
      "Auditory Learner": "detailed",
      "General Learner": "normal",
    };

    const mappedLevel = profileToDetailMap[learningProfile];
    if (mappedLevel) {
      setDetailLevel(mappedLevel);
    }
  }, [learningProfile]);
  const [loading, setLoading] = useState(false);

  const fetchTips = async () => {
    try {
      setLoadingTips(true);
      const res = await fetch("/api/generate-tips");
      const data = await res.json();
      setTips(data.tips || []);
    } catch (error) {
      console.error("Error fetching tips:", error);
    } finally {
      setLoadingTips(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    try {
      const profileRaw = localStorage.getItem("profile");
      const profile = profileRaw ? JSON.parse(profileRaw) : null;
      const response = await axios.post("/api/explain", {
        topic,
        subject: selectedSubject,
        detail: detailLevel,
        profile,
      });
      setResult(response.data.explanation);
    } catch (error) {
      console.error("Error:", error);
      setResult("An error occurred while fetching the explanation.");
    } finally {
      setLoading(false);
    }
  };

  const saveExplanation = () => {
    const saved = JSON.parse(localStorage.getItem("mindpilot_explanations")) || [];
    const newEntry = {
      topic,
      subject: selectedSubject,
      detail: detailLevel,
      explanation: result,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("mindpilot_explanations", JSON.stringify([newEntry, ...saved]));
    alert("Explanation saved successfully!");
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic.replace(/\s+/g, "_")}_explanation.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
    {learningProfile && (
      <div style={{ 
        marginBottom: "1rem", 
        background: "var(--bg-secondary)", 
        padding: "1rem", 
        borderRadius: "8px",
        border: "1px solid var(--border-color)",
        color: "var(--text-primary)"
      }}>
        <strong>Your Learning Profile:</strong> {learningProfile}
      </div>  
    )}
      <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <FiBookOpen /> MindPilot
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic"
          style={{
            flex: "1 1 100%",
            padding: "0.5rem",
            border: "1px solid var(--input-border)",
            borderRadius: "4px",
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
          }}
        />
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          style={{
            flex: "1 1 48%",
            padding: "0.5rem",
            border: "1px solid var(--input-border)",
            borderRadius: "4px",
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
          }}
        >
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.label}
            </option>
          ))}
        </select>
        <div
          style={{
            flex: "1 1 48%",
            padding: "0.5rem",
            border: "1px solid var(--input-border)",
            borderRadius: "4px",
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center"
          }}
          title="Based on your learning profile"
        >
          Detail level: {detailLevel}
        </div>
        <button
          type="submit"
          style={{
            flex: "1 1 100%",
            padding: "0.5rem 1rem",
            backgroundColor: "var(--button-primary)",
            color: "white",
            border: "none",
            borderRadius: "4px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <FiSend /> Explain
        </button>
      </form>

      {loading && (
        <p
          className="spin"
          style={{
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <FiLoader /> Loading...
        </p>
      )}

      {result && (
        <div
          className="explanation-box"
        >
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiBookOpen /> Explanation
          </h2>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(marked(result)),
            }}
            style={{
              lineHeight: "1.6",
              whiteSpace: "pre-line",
            }}
          ></div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            <button
              onClick={saveExplanation}
              style={{
                flex: 1,
                padding: "0.5rem 1rem",
                backgroundColor: "var(--button-primary)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FiSave /> Save
            </button>
            <button
              onClick={handleDownload}
              style={{
                flex: 1,
                padding: "0.5rem 1rem",
                backgroundColor: "var(--button-secondary)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FiDownload /> Download
            </button>
          </div>
        </div>
      )}

      {/* Learning Tips Section */}
      <div style={{ 
        marginTop: "2rem",
        padding: "1.5rem",
        backgroundColor: "var(--bg-secondary)",
        borderRadius: "8px",
        border: "1px solid var(--border-color)",
        boxShadow: "var(--shadow)"
      }}>
        <h2 style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "0.5rem",
          marginBottom: "1rem",
          color: "var(--text-primary)"
        }}>
          💡 Learning Tips
        </h2>
        {loadingTips ? (
          <p style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5rem",
            color: "var(--text-secondary)"
          }}>
            <FiLoader /> Loading tips...
          </p>
        ) : (
          <ul style={{ 
            listStyle: "none", 
            padding: 0,
            margin: 0
          }}>
            {tips.map((tip, idx) => (
              <li key={idx} style={{ 
                marginBottom: "0.75rem", 
                padding: "0.75rem",
                backgroundColor: "var(--bg-primary)",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
                lineHeight: "1.5"
              }}>
                {tip}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MainPage;
