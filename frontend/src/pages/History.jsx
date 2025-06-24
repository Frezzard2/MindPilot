import React, { useEffect, useState } from "react";
import { FiBookOpen, FiClock } from "react-icons/fi";
import { marked } from "marked";
import DOMPurify from "dompurify";

function History() {
  const [savedExplanations, setSavedExplanations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const deleteExplanation = (timestamp) => {
    const updated = savedExplanations.filter((item) => item.timestamp !== timestamp);
    localStorage.setItem("mindpilot_explanations", JSON.stringify(updated));
    setSavedExplanations(updated);
  }; 

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mindpilot_explanations")) || [];
    setSavedExplanations(saved);
  }, []);

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "2rem" }}>
      <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <FiClock /> Explanation History
      </h1>
      <input 
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by topic or subject"
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1rem",
          border: "1px solid #ccc",
        }}
      />
      {savedExplanations.length === 0 ? (
        <p>No saved explanations found.</p>
      ) : (
        savedExplanations.filter((item) =>
          item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.subject.toLowerCase().includes(searchTerm.toLowerCase())
        ).map((entry, index) => (
          <div
            key={index}
            className="explanation-box"
          >
            <h3>{entry.topic}</h3>
            <p style={{ fontSize: "0.9rem", color: "#666" }}>
              Subject: <strong>{entry.subject}</strong> | Detail:{" "}
              <strong>{entry.detail}</strong> |{" "}
              {new Date(entry.timestamp).toLocaleString()}
            </p>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked(entry.explanation)),
              }}
              style={{ marginTop: "1rem", lineHeight: "1.6" }}
            ></div>
            <button 
              onClick={() => deleteExplanation(entry.timestamp)}
              style={{
                marginTop: "0.5rem",
                padding: "0.3rem 0.6rem",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem"
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default History;
