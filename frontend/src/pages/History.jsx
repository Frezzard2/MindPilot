import React, { useEffect, useState } from "react";
import { FiBookOpen, FiClock } from "react-icons/fi";
import { marked } from "marked";
import DOMPurify from "dompurify";

function History() {
  const [savedExplanations, setSavedExplanations] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mindpilot_explanations")) || [];
    setSavedExplanations(saved);
  }, []);

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "2rem" }}>
      <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <FiClock /> Explanation History
      </h1>

      {savedExplanations.length === 0 ? (
        <p>No saved explanations found.</p>
      ) : (
        savedExplanations.map((entry, index) => (
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
          </div>
        ))
      )}
    </div>
  );
}

export default History;
