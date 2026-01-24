import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!text.trim()) return alert("Please enter some text first!");

    setLoading(true);
    setResult("");

    try {
      // If running locally, use http://localhost:8000/analyze
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setResult(data.sentiment);
    } catch (error) {
      console.error("Error:", error);
      setResult("Error: Could not reach the sentiment server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "500px" }}>
      <h2>Sentiment Analyzer</h2>

      <textarea
        rows="4"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        placeholder="How are you feeling?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />

      <button 
        onClick={analyze} 
        disabled={loading}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {loading && <p>⏳ Processing sentiment...</p>}
      {result && (
        <p style={{ marginTop: "20px", fontSize: "1.2rem" }}>
          <b>Result:</b> {result}
        </p>
      )}
    </div>
  );
}

export default App;