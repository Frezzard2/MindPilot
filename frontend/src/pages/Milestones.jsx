import React, { useState, useEffect } from "react";

function Milestones() {
    const [title, setTitle] = useState("");
    const [deadline, setDeadline] = useState("");
    const [milestones, setMilestones] = useState([]);
    const [tips, setTips] = useState([]);
    const [loadingTips, setLoadingTips] = useState(false);

    // Calculate progress
    const completedCount = milestones.filter(m => m.completed).length;
    const totalCount = milestones.length;
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Check for overdue milestones
    const today = new Date();
    const overdueMilestones = milestones.filter(m => !m.completed && new Date(m.deadline) < today);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("mindpilot_milestones")) || [];
        setMilestones(saved);
    }, []);

    useEffect(() => {
        fetchTips();
    }, []);

    const fetchTips = async () => {
        try {
            setLoadingTips(true);
            const res = await fetch("/api/generate-tips");
            const data = await res.json();
            setTips(data.tips || []);
        } catch (error) {
            console.error("Error fetching tips:", error);
        } finally {
            setLoadingTips(false);
        }
    };

    // Fetch tips only once when the component mounts
    useEffect(() => {
        fetchTips();
    }, []);

    // Save milestones to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("mindpilot_milestones", JSON.stringify(milestones));
    }, [milestones]);

    const addMilestone = (e) => {
        e.preventDefault();
        if (!title || !deadline) {
            alert("Please fill in both fields.");
            return;
        }
        const newItem = {
            id: Date.now(),
            title,
            deadline,
            completed: false,
        };
        setMilestones([newItem, ...milestones]);
        setTitle("");
        setDeadline("");
    };

    const toggleComplete = (id) => {
        const updated = milestones.map((m) => m.id === id ? { ...m, completed: !m.completed } : m);
        setMilestones(updated);
    };

    const deleteMilestone = (id) => {
        const updated = milestones.filter((m) => m.id !== id);
        setMilestones(updated);
    };

    return (
        <div style={{padding: "1rem"}}>
            <h1 style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>📅 My Learning Milestones</h1>
            
            {/* Progress Bar */}
            {totalCount > 0 && (
                <div style={{ 
                    marginBottom: "1.5rem",
                    padding: "1rem",
                    backgroundColor: "var(--bg-secondary)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)"
                }}>
                    <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        marginBottom: "0.5rem",
                        color: "var(--text-primary)"
                    }}>
                        <span>Progress: {completedCount}/{totalCount} completed</span>
                        <span>{progressPercentage}%</span>
                    </div>
                    <div style={{
                        width: "100%",
                        height: "8px",
                        backgroundColor: "var(--border-color)",
                        borderRadius: "4px",
                        overflow: "hidden"
                    }}>
                        <div style={{
                            width: `${progressPercentage}%`,
                            height: "100%",
                            backgroundColor: "var(--button-primary)",
                            transition: "width 0.3s ease"
                        }}></div>
                    </div>
                </div>
            )}

            {/* Overdue Warning */}
            {overdueMilestones.length > 0 && (
                <div style={{
                    marginBottom: "1.5rem",
                    padding: "1rem",
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    color: "#dc2626"
                }}>
                    ⚠️ You have {overdueMilestones.length} overdue milestone{overdueMilestones.length > 1 ? 's' : ''}!
                </div>
            )}
            <form onSubmit={addMilestone} style={{
                marginBottom: "2rem", 
                padding: "1.5rem",
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow)"
            }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                    <input 
                        type="text"
                        placeholder="Milestone title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ 
                            flex: "1 1 200px",
                            padding: "0.5rem", 
                            border: "1px solid var(--input-border)",
                            borderRadius: "4px",
                            backgroundColor: "var(--input-bg)",
                            color: "var(--text-primary)"
                        }}
                    />
                    <input 
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        style={{ 
                            flex: "1 1 150px",
                            padding: "0.5rem", 
                            border: "1px solid var(--input-border)",
                            borderRadius: "4px",
                            backgroundColor: "var(--input-bg)",
                            color: "var(--text-primary)"
                        }}
                    />
                </div>
                <button type="submit" style={{ 
                    padding: "0.5rem 1rem", 
                    backgroundColor: "var(--button-primary)", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                }}>
                    Add Milestone
                </button>
            </form>

            {milestones.length === 0 ? (
                <p>No milestones added yet. Start by adding one!</p>
            ) : (
                <ul>
                    {milestones.map((m) => (
                        <li
                            key={m.id}
                            style={{
                                marginBottom: "0.5rem",
                                padding: "1rem",
                                background: m.completed ? "var(--bg-secondary)" : "var(--bg-primary)",
                                color: "var(--text-primary)",
                                borderRadius: "8px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                border: m.completed ? "1px solid var(--border-color)" : 
                                       new Date(m.deadline) < today ? "2px solid #dc2626" : "1px solid var(--border-color)",
                                boxShadow: "var(--shadow)",
                                transition: "all 0.3s ease"
                            }}
                        >
                        <div style={{ flex: 1 }}>
                            <strong style={{ 
                                textDecoration: m.completed ? "line-through" : "none",
                                color: m.completed ? "var(--text-secondary)" : "var(--text-primary)",
                                fontSize: "1.1rem"
                            }}>
                                {m.title}
                            </strong>
                            <div style={{ 
                                fontSize: "0.9rem", 
                                color: "var(--text-secondary)",
                                marginTop: "0.25rem"
                            }}>
                                📅 Due: {new Date(m.deadline).toLocaleDateString()}
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                                onClick={() => toggleComplete(m.id)}
                                style={{ 
                                    padding: "0.5rem 1rem", 
                                    backgroundColor: m.completed ? "var(--button-secondary)" : "var(--button-primary)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "0.875rem",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                {m.completed ? "✅ Undo" : "✓ Complete"}
                            </button>
                            <button
                                onClick={() => deleteMilestone(m.id)}
                                style={{ 
                                    padding: "0.5rem 1rem", 
                                    backgroundColor: "var(--button-danger)", 
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "0.875rem",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                🗑️ Delete
                            </button>
                        </div>
                        </li>
                    ))}
                </ul>
            )}
            {/* Tips Section */}
            <div style={{ 
                marginBottom: "1.5rem",
                padding: "1rem",
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
            }}>
                <h2 style={{ marginBottom: "0.5rem", color:" var(--text-primary)"}}>💡 Learning Tips</h2>
                {loadingTips ? (
                    <p>Loading tips...</p>
                ) : (
                    <ul>
                        {tips.map((tip, idx) => (
                            <li key={idx} style={{ marginBottom: "0.5rem", color: "var(--text-secondary)" }}>
                                {tip}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Milestones;