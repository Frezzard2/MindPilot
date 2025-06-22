import { useState, useEffect } from "react";
import axios from "axios";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { FiSend, FiBookOpen, FiLoader, FiDownload } from "react-icons/fi";
import "./App.css";


function App() {

  const subjects = [
    { id: "math", label: "Mathematics"},
    { id: "prog", label: "Programming"},
    { id: "phys", label: "Physics"},
    { id: "chem", label: "Chemistry"},
    { id: "bio", label: "Biology"},
    { id: "hist", label: "History"},
    { id: "geo", label: "Geography"},
    { id: "eng", label: "English"},
    { id: "art", label: "Art",},
    { id: "music", label: "Music"},
];

  const [topic, setTopic] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].id);
  const [detailLevel, setDetailLevel] = useState("normal")
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
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
    setSavedExplanations([newEntry, ...saved]);
    alert("Explanation saved successfully!");
  };
  const [savedExplanations, setSavedExplanations] = useState([]);
  const loadSavedExplanations = () => {
    const saved = JSON.parse(localStorage.getItem("mindpilot_explanations")) || [];
    setSavedExplanations(saved);
  };

  useEffect(() => {
  loadSavedExplanations();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    try {
      const response = await axios.post("http://localhost:8000/api/explain", {
        topic,
        subject: selectedSubject,
        detail: detailLevel,
      });
      console.log("RESPONSE:", response.data);
      setResult(response.data.explanation);
    } catch (error) {
      console.error("Error:", error);
      setResult("An error occurred while fetching the explanation.");
    } finally {
      setLoading(false);
    }
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
    <div
      style={{
        maxWidth: "600px",
        margin: "auto",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        color: "#111",
      }}
    >
      <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <FiBookOpen /> MindPilot
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic"
          style={{
            flex: 1,
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <select 
          value={detailLevel}
          onChange={(e) => setDetailLevel(e.target.value)}
          style={{
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}>
            <option value="simple">Simple</option>
            <option value="normal">Normal</option>
            <option value="detailed">Detailed</option>
          </select>
        <button
          type="submit"
          style={{
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
          <FiSend /> Explain
        </button>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              marginBottom: "1rem",
              width: "100%",
            }}
          >
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.label}
              </option>
            ))}
          </select>

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
          style={{
            marginTop: "2rem",
            background: "#f5f5f5",
            padding: "1rem",
            borderRadius: "4px",
          }}
        >
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiBookOpen /> Explanation
          </h2>
          <div
            dangerouslySetInnerHTML={{
              __html:DOMPurify.sanitize(marked(result)),
            }}
            style={{
              lineHeight: "1.6",
              whiteSpace: "pre-line",
          }}
          ></div>
          <button
            onClick={saveExplanation}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FiBookOpen /> Save Explanation
          </button>
          <button
            onClick={handleDownload}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FiDownload /> Download Explanation
            </button>
        </div>
      )}
    </div>
  );
}

export default App;
