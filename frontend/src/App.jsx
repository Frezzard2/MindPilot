import React, { useState } from "react";
import axios from "axios";

function App() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/explain", { topic });
      // Backend válasz: { explanation: "szöveg" }
      setResult(response.data.explanation);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem" }}>
      <h1>MindPilot</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic"
          required
          style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
        />
        <button type="submit" style={{ marginTop: "1rem", padding: "0.5rem 1rem", fontSize: "1rem" }}>
          Explain
        </button>
      </form>

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "2rem", background: "#f5f5f5", padding: "1rem", whiteSpace: "pre-wrap" }}>
          <h2>Explanation</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default App;
