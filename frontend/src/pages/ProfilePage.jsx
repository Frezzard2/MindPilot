import React from "react";
import { Link, useNavigate } from "react-router-dom";



export default function ProfilePage() {
    const navigate = useNavigate();
    const stored = localStorage.getItem("profile");
    const profile = stored ? JSON.parse(stored) : null;
    const strengths = Array.isArray(profile?.strengths) ? profile.strengths : [];
    const challenges = Array.isArray(profile?.challenges) ? profile.challenges : [];
    const preferredModalities = Array.isArray(profile?.preferredModalities) ? profile.preferredModalities : [];
    const studyTactics = Array.isArray(profile?.studyTactics) ? profile.studyTactics : [];
    const scheduleHints = Array.isArray(profile?.scheduleHints) ? profile.scheduleHints : [];
    const focusEnvironment = Array.isArray(profile?.focusEnvironment) ? profile.focusEnvironment : [];

    if (!profile) {
        return (
            <div style={{ maxWidth: 800, margin: "2rem auto", padding: "1rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold"}}>No profile yet</h2>
                <p>Complete the Learning Style Quiz to generate your adaptive profile.</p>
                <Link to="/" style={{ color: "var(--button-primary)" }}> Go to Quiz</Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 900, margin: "2rem auto", padding: "1rem" }}>
            <header style={{ marginBottom: "1.5rem"}}>
                <h1 style={{ fontSize: "2rem", fontWeight: "bold"}}>Your Adaptive Profile</h1>
                <p style={{ opacity: 0.8 }}>
                    Style: <strong>{profile.styleType}</strong>
                    {typeof profile.confidence === 'number' ? <> · Confidence: {Math.round(profile.confidence * 100)}%</> : null}
                </p>
            </header>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <button
                    onClick={() => { localStorage.removeItem("profile"); navigate("/"); }}
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "var(--button-primary)",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer"
                    }}
                >
                    Retake Quiz
                </button>
            </div>

            <Section title="Strengths" items={strengths}/>
            <Section title="Challenges" items={challenges} />
            <Section title="Preferred Modalities" items={preferredModalities} />
            <Section title="Study Tactics" items={studyTactics} />
            <Section title="Schedule Hints" items={scheduleHints} />
            <Section title="Focus Environment" items={focusEnvironment} />

            <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid var(--border-color)", borderRadius: 8}}>
                <h3 style={{ margin: 0 }}>Reading Level Hint</h3>
                <p style={{ marginTop: "0.5rem"}}>{profile.readingLevelHint}</p>
            </div>

            <footer style={{ marginTop: "1.5rem", opacity: 0.7}}>   
                <small>Profile version: {profile.version}</small>
            </footer>
        </div>
    );
}

function Section({ title, items }) {
    if (!items || items.length === 0) return null;
    return (
        <div style={{ marginBottom: "1rem"}}>
            <h3 style={{marginBottom: "0.5rem"}}>{title}</h3>
            <ul style={{margin: 0, paddingLeft: "1.2rem"}}>
                {items.map((it, i) => <li key={i}>{it}</li>)}
            </ul>
        </div>
    );
}