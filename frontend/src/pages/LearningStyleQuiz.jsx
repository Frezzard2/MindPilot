import React, { useState } from "react";
import { Form } from "react-router-dom";

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
        question: "When studying, I like to use:",
        options: ["Textbooks and notes", "Podcasts and videos", "Mind maps and diagrams", "Interactive exercises"]
    },
    {
        question: "I prefer learning environments that are:",
        options: ["Quiet and focused", "Interactive and social", "Visual and colorful", "Hands-on and practical"]
    },
    {
        question: "When solving problems, I usually:",
        options: ["Think through them step by step", "Talk through them with others", "Draw or visualize them", "Try different approaches"]
    }
];

export default function LearningStyleQuiz({ onComplete }) {
    const [answers, setAnswers] = useState(Array(questions.length).fill(""));
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (index, value) => {
        const updated = [...answers]
        updated[index] = value;
        setAnswers(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answers.includes("")) {
            alert("Please answer all questions.");
            return;
        }

        // Analyze answers to determine learning profile
        let profileType = "General Learner";
        
        // Analyze answers to determine learning style
        const visualAnswers = answers.filter(answer => 
            answer && (answer.toLowerCase().includes('diagram') || 
            answer.toLowerCase().includes('chart') ||
            answer.toLowerCase().includes('visual') ||
            answer.toLowerCase().includes('mind maps') ||
            answer.toLowerCase().includes('colorful'))
        ).length;
        
        const auditoryAnswers = answers.filter(answer => 
            answer && (answer.toLowerCase().includes('listen') || 
            answer.toLowerCase().includes('discuss') ||
            answer.toLowerCase().includes('talk') ||
            answer.toLowerCase().includes('podcasts') ||
            answer.toLowerCase().includes('social'))
        ).length;
        
        const textAnswers = answers.filter(answer => 
            answer && (answer.toLowerCase().includes('read') || 
            answer.toLowerCase().includes('write') ||
            answer.toLowerCase().includes('textbook') ||
            answer.toLowerCase().includes('notes') ||
            answer.toLowerCase().includes('step by step'))
        ).length;

        if (visualAnswers > auditoryAnswers && visualAnswers > textAnswers) {
            profileType = "Visual Learner";
        } else if (auditoryAnswers > visualAnswers && auditoryAnswers > textAnswers) {
            profileType = "Auditory Learner";
        } else if (textAnswers > visualAnswers && textAnswers > auditoryAnswers) {
            profileType = "Text-Based Learner";
        }

        const learningProfile = {
            type: profileType,
            answers,
            completedAt: new Date().toISOString(),
        };

        localStorage.setItem("learningProfile", JSON.stringify(learningProfile));
        setSubmitted(true);
        if (onComplete) onComplete(learningProfile);
    };

    if (submitted) {
        return <div className="p-4 text-center">Thank you! Your profile has been saved.</div>;
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
                </div>
            ))}

            <button
                type="submit"
                style={{
                    width: "100%",
                    padding: "1rem",
                    backgroundColor: "var(--button-primary)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                }}
            >
                Submit Answers
            </button>
        </form>
    );
}