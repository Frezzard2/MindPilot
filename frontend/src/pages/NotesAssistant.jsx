import React, {useState} from 'react';
import axios from 'axios';
import {marked, options} from 'marked';
import DOMPurify from 'dompurify';
import {FiUpload, FiFileText, FiSend, FiLoader, FiBookOpen, FiDownload, FiSave} from 'react-icons/fi';

function NotesAssistant() {
    const subjects = [
        {id: "math", label: "Mathematics"},
        {id: "prog", label: "Programming"},
        {id: "phys", label: "Physics"},
        {id: "chem", label: "Chemistry"},
        {id: "bio", label: "Biology"},
        {id: "hist", label: "History"},
        {id: "geo", label: "Geography"},
        {id: "eng", label: "English"},
        {id: "art", label: "Art"},
        {id: "music", label: "Music"}
    ];

    const [selectedSubject, setSelectedSubject] = useState(subjects[0].id);
    const deriveDetailFromProfile = () => {
        
        try {
            const stored = localStorage.getItem("profile");
            if (!stored) return "normal";
            const parsed = JSON.parse(stored);
            const type = typeof parsed === "object" ? (parsed.styleType || parsed.type) : (typeof parsed === "string" ? parsed : null);
            const map = {
                "Beginner": "simple",
                "Visual Learner": "detailed",
                "Text-Based Learner": "normal",
                "Auditory Learner": "detailed",
                "General Learner": "normal",
            };
            return map[type] || "normal";
        } catch {
            return "normal";
        }
    };
    const [notesText, setNotesText] = useState("");
    const [file, setFile] = useState(null);
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const API_BASE = "";

    const onFileChange = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setFile(null);
            return;
        }
        const f = e.target.files[0];
        setFile(f);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResult("");
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("subject", selectedSubject);
            formData.append("detail_level", deriveDetailFromProfile());
            try {
                const profileRaw = localStorage.getItem("profile");
                if (profileRaw) {
                    formData.append("profile", profileRaw);
                }
            } catch {}

            if (file) {
                formData.append("file", file);
            } else if (notesText.trim().length > 0) {
                formData.append("text", notesText.trim());
            } else {
                setError("Please provide either a file or text input.");
                setLoading(false);
                return;
            }

            const resp = await axios.post(`${API_BASE}/api/explain-from-notes`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setResult(resp.data.explanation);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError("An error occurred while processing your request. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    const saveExplanation = () => {
        const saved = JSON.parse(localStorage.getItem("mindpilot_explanations")) || [];
        const newEntry = {
            topic: file ? `Notes from ${file.name}` : "Notes explanation",
            subject: selectedSubject,
            detail: deriveDetailFromProfile(),
            explanation: result,
            timestamp: new Date().toISOString(),
            source: "notes_assistant"
        };
        localStorage.setItem("mindpilot_explanations", JSON.stringify([newEntry, ...saved]));
        alert("Explanation saved successfully!");
    };

    const handleDownload = () => {
        const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const fileName = file ? `${file.name.replace('.txt', '')}_explanation.txt` : "notes_explanation.txt";
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "1rem"}}>
            <h1 style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
                <FiFileText /> Notes Explanation
            </h1>

            <form onSubmit={handleSubmit} style={{
                display: "grid",
                gap: "0.75rem",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: 8,
                padding: "1rem"
            }}> 
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <select 
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        style={{ flex: "1 1 200px", padding: "0.5rem"}}
                    >
                        {subjects.map(s => 
                            <option key={s.id} value={s.id}>{s.label}</option>
                        )}
                    </select>
                        
                    <div 
                        style={{ flex: "1 1 200px", padding: "0.5rem", border: "1px solid var(--border-color)", borderRadius: 6, background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
                        title="Based on your learning profile"
                    >
                        Detail level: {deriveDetailFromProfile()}
                    </div>
                </div>

                <label style={{ fontWeight: 600}}>Paste notes (optional):</label>
                <textarea
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    placeholder="Paste your notes here..."
                    style={{ width: "100%", padding: "0.75rem", borderRadius: 6, border: "1px solid var(--input-border)" }}
                />

                <div>
                    <label style={{ fontWeight: 600, display: "block", marginBottom: 6}}>
                        Or upload a .txt file:
                    </label>
                    <input type="file" accept='.txt,text/plain' onChange={onFileChange} />
                    { file && (
                        <div style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
                            Selected file: {file.name}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    style= {{
                        padding: "0.6rem 1rem",
                        background: "var(--button-primary)",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        transition: "background 0.2s ease",
                        width: "100%",
                        justifyContent: "center"
                    }}
                    disabled={loading}
                >
                    {loading ? <><FiLoader className="spin" /> Generating...</> : <><FiSend /> Explain my notes</>}
                </button>

                {error && (
                    <div style={{ padding: "0.5rem 0.75rem", border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", borderRadius: 6 }}>
                        {error}
                    </div>
                )}
            </form>
            {result && (
                <div style={{ marginTop: "1rem", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", padding: "1rem" }}>
                    <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <FiBookOpen /> Explanation
                    </h2>
                    <div
                        style={{ lineHeight: 1.6}}
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(result)) }}
                    />
                    
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
                                cursor: "pointer",
                                transition: "background 0.2s ease"
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
                                cursor: "pointer",
                                transition: "background 0.2s ease"
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

export default NotesAssistant;