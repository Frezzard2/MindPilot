import { use, useState } from "react";
import axios from "axios";

function App() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setResult("");

  try {
    const response = await axios.post("http://127.0.0.1:8000/api/explain", {
      topic: topic,
    });
    console.log("RESPONSE:", response.data);
    setResult(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    setResult("Something went wrong.");
  }

  setLoading(false);
};
  // Handle the form submission

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem" }}>
      <h1>Mindpilot</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic"
        />
          <button type="submit">Explain</button>
      </form>


      {result && (
        <div style={{ marginTop: "2rem", background: "#f5f5f5", padding: "1rem" }}>
          <h2>Explanation</h2>
          <p>{result}</p>
          </div>
        )}  
    </div>
  );
}

export default App;
