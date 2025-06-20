import { useState } from "react";
import axios from "axios";
import { FiSend, FiBookOpen, FiLoader } from "react-icons/fi";
import "./App.css";

function App() {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("General");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    try {
      const response = await axios.post("http://localhost:8000/api/explain", {
        topic,
        subject,
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

  const subjects = ["General", "Math", "History", "Physics", "Biology"];

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
      </form>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => setSubject(s)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: subject === s ? "#4f46e5" : "#e5e7eb",
              color: subject === s ? "white" : "#111",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {s}
          </button>
        ))}
      </div>

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
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default App;
