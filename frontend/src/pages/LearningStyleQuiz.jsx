import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const questions = [
    {
        question: "When learning something new, I prefer to:",
        options: ["Read about it", "Listen to explanations", "See diagrams and charts", "Try it hands-on"]
    },
    {
        question: "I remember information best when I:",
        options: ["Write it down", "Discuss it with others", "See it visually", "Practice it repeatedly"]
    },
    {
        question: "How comfortable are you with summarizing what you learned in your own words?",
        type: "scale"
    },
    {
        question: "When studying, I like to use:",
        options: ["Textbooks and notes", "Podcasts and videos", "Mind maps and diagrams", "Interactive exercises"]
    },
    {
        question: "I prefer learning environments that are:",
        options: ["Quiet and focused", "Interactive and social", "Visual and colorful", "Hands-on and practical"]
    },
    {
        question: "How effective are short timed focus sessions (e.g., 25 minutes)?",
        type: "scale"
    },
    {
        question: "When solving problems, I usually:",
        options: ["Think through them step by step", "Talk through them with others", "Draw or visualize them", "Try different approaches"]
    },
    {
        question: "How helpful are checklists or step-by-step plans for you?",
        type: "scale"
    },
    {
        question: "How much do you rely on example-based practice vs. theory?",
        type: "scale"
    },
    {
        question: "How do you prefer to organize information while studying?",
        options: ["I make bullet-point notes", "I create visual mind maps", "I discuss the topic with others", "I don’t organize, I just read/watch"]
    },
    {
        question: "How much do you rely on repetition when memorizing something?",
        type: "scale", // jelöljük, hogy slideres kérdés
    },
    {
        question: "When faced with a difficult topic, what’s your first instinct?",
        options: ["Search for video explanations", "Read an in-depth article or textbook", "Ask someone to explain it to me", "Try solving related exercises right away"]
    },
    {
        question: "How well do you remember visuals like graphs, charts, or diagrams?",
        type: "scale",
    },
    {
        question: "What helps you stay focused while learning?",
        options: ["A quiet environment", "Music or background sound", "Talking about the topic with others", "Switching tasks frequently"]
    },
    {
        question: "How much do you benefit from teaching others to reinforce learning?",
        type: "scale"
    }
];

export default function LearningStyleQuiz({ onComplete }) {
    const initialAnswers = questions.map(q => q.type === "scale" ? "5" : "");
    const [answers, setAnswers] = useState(initialAnswers);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const API_BASE = import.meta.env.VITE_API_BASE || window.location.origin;
    const navigate = useNavigate();

    const handleChange = (index, value) => {
        const updated = [...answers];
        updated[index] = value;
        setAnswers(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (answers.includes("")) {
            alert("Please answer all questions.");
            return;
        }
        setIsSubmitting(true);

        // Tanulási profil meghatározása
        let profileType = "General Learner";

        const visualAnswers = answers.filter(answer =>
            answer && (
                answer.toLowerCase().includes("diagram") ||
                answer.toLowerCase().includes("chart") ||
                answer.toLowerCase().includes("visual") ||
                answer.toLowerCase().includes("mind map") ||
                answer.toLowerCase().includes("colorful")
            )
        ).length;

        const auditoryAnswers = answers.filter(answer =>
            answer && (
                answer.toLowerCase().includes("listen") ||
                answer.toLowerCase().includes("discuss") ||
                answer.toLowerCase().includes("talk") ||
                answer.toLowerCase().includes("podcast") ||
                answer.toLowerCase().includes("social")
            )
        ).length;

        const textAnswers = answers.filter(answer =>
            answer && (
                answer.toLowerCase().includes("read") ||
                answer.toLowerCase().includes("write") ||
                answer.toLowerCase().includes("textbook") ||
                answer.toLowerCase().includes("notes") ||
                answer.toLowerCase().includes("step by step")
            )
        ).length;

        if (visualAnswers > auditoryAnswers && visualAnswers > textAnswers) {
            profileType = "Visual Learner";
        } else if (auditoryAnswers > visualAnswers && auditoryAnswers > textAnswers) {
            profileType = "Auditory Learner";
        } else if (textAnswers > visualAnswers && textAnswers > auditoryAnswers) {
            profileType = "Text-Based Learner";
        } else {
            profileType = "Balanced Learner";
        }

        const learningProfile = {
            type: profileType,
            answers,
            completedAt: new Date().toISOString(),
        };

        try {
            localStorage.setItem("profile", JSON.stringify(learningProfile));
            const res = await axios.post(`${API_BASE}/api/profile/generate`, {
                answers,
                locale: "en"
            });

            const adaptive = res.data?.profile;
            if (adaptive) {
                localStorage.setItem("profile", JSON.stringify(adaptive));
            }

            setSubmitted(true);
            navigate("/profile");
            if (onComplete) onComplete(learningProfile);
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("There was an error saving your profile. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="p-4 text-center">
                <h2 className="text-xl font-bold">Thank you! 🎉</h2>
                <p>Your learning profile has been saved.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{
            padding: "2rem",
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "var(--bg-secondary)",
            borderRadius: "8px",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow)"
        }}>
            <h2 style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "2rem",
                color: "var(--text-primary)",
                textAlign: "center"
            }}>
                Learning Style Quiz
            </h2>

            {questions.map((q, idx) => (
                <div key={idx} style={{ marginBottom: "2rem" }}>
                    <label style={{
                        display: "block",
                        marginBottom: "1rem",
                        fontWeight: "bold",
                        color: "var(--text-primary)",
                        fontSize: "1.1rem"
                    }}>
                        {q.question}
                    </label>

                    {/* Ha slideres kérdés */}
                    {q.type === "scale" ? (
                        <div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={answers[idx] || "5"}
                                onChange={(e) => handleChange(idx, e.target.value)}
                                style={{ width: "100%" }}
                            />
                            <div style={{ marginTop: 8, color: "var(--text-secondary)" }}>Selected: {answers[idx] || "5"}</div>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {q.options.map((option, optionIdx) => (
                                <label key={optionIdx} className="quiz-option" style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                    padding: "0.75rem",
                                    backgroundColor: "var(--bg-primary)",
                                    borderRadius: "4px",
                                    border: "1px solid var(--border-color)",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease"
                                }}>
                                    <input
                                        type="radio"
                                        name={`question-${idx}`}
                                        value={option}
                                        checked={answers[idx] === option}
                                        onChange={(e) => handleChange(idx, e.target.value)}
                                        required
                                        style={{ margin: 0 }}
                                    />
                                    <span style={{ color: "var(--text-primary)" }}>{option}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            <button
                type="submit"
                disabled={isSubmitting}
                style={{
                    width: "100%",
                    padding: "1rem",
                    backgroundColor: "var(--button-primary)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    opacity: isSubmitting ? 0.7 : 1
                }}
            >
                {isSubmitting ? "Submitting..." : "Submit Answers"}
            </button>
        </form>
    );
}