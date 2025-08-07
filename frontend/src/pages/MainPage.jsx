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
  useEffect(() => {
    if (!learningProfile) return;

    const profileToDetailMap = {
      "beginner": "simple",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    try {
      const response = await axios.post("/api/explain", {
        topic,
        subject: selectedSubject,
        detail: detailLevel,
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
      <div style={{ marginBottom: "1rem", background: "#eef", padding: "1rem", borderRadius: "8px"}}>
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
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          style={{
            flex: "1 1 48%",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.label}
            </option>
          ))}
        </select>
        <select
          value={detailLevel}
          onChange={(e) => setDetailLevel(e.target.value)}
          style={{
            flex: "1 1 48%",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <option value="simple">Simple</option>
          <option value="normal">Normal</option>
          <option value="detailed">Detailed</option>
        </select>
        <button
          type="submit"
          style={{
            flex: "1 1 100%",
            padding: "0.5rem 1rem",
            backgroundColor: "#4f46e5",
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
                backgroundColor: "#4f46e5",
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
                backgroundColor: "#10b981",
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
    </div>
  );
}

export default MainPage;
