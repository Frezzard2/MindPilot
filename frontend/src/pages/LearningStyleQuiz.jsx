import React, { useState } from "react";
import { Form } from "react-router-dom";

const questions = [
    "Do you prefer reading or listening when learning something new?",
    "How do you remember things better: writing them down or discussing them?",
    "Do you like to learn with visuals like diagrams and charts?",
    "How often do you take breaks during study sessions?",
    "Do you prefer structured plans or learning freely as you go?",
    "How comfortable are you with self-paced learning?",
    "Do you learn better by doing (hands-on) or observing?",
    "How often do you review old material?",
    "Do you use digital tools (e.g., flashcards, apps) for studying?",
    "How well do you concentrate in longer study sessions?",
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

        const learningprofile = {
            answers,
            completedAt: new Date().toISOString(),
        };

        localStorage.setItem("learning_profile", JSON.stringify(learningprofile));
        setSubmitted(true);
        if (onComplete) onComplete(learningProfile);
    };

    if (submitted) {
        return <div className="p-4 text-center">Thank you! Your profile has been saved.</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Learning Style Quiz</h2>

            {questions.map((q, idx) => (
                <div key={idx}>
                    <label className="block mb-2 font-medium">{q}</label>
                    <input 
                        type="text"
                        value={answers[idx]}
                        onChange={(e) => handleChange(idx, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded required"
                    />
                </div>
            ))}

            <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
                Submit Answers
            </button>
        </form>
    );
}