# 🧠 MindPilot – Your Personal AI Learning Companion

MindPilot is an intelligent learning assistant designed to help students at every level—no matter what or how they learn. Whether you're preparing for an exam, exploring a new topic, or just trying to build a better study habit, MindPilot is your go-to companion.

## 🚀 Vision

To create a truly adaptive, AI-powered study partner that:
- Understands individual learning styles.
- Supports diverse academic goals.
- Evolves with the student.
- Makes learning personalized, accessible, and engaging.

## 🌟 Core Features (v1.0 Launch)

✅ **Topic Explainer** – Get AI-generated explanations tailored to your subject and detail preference.

✅ **Smart Explanation Detail** – Choose between simple, normal, or detailed explanations.

✅ **Save & Download** – Save explanations locally or download them as text files.

✅ **Local History** – Previously saved content is stored in local storage (offline support).

✅ **Markdown Rendering** – Beautiful, readable formatting with support for code, math, and lists.

✅ **Clean UI** – Intuitive, responsive interface built with React and TailwindCSS.

✅ **Backend-Powered by FastAPI** – Efficient and scalable backend with Cohere integration for natural language generation.

## 👤 Planned for v2.0+ (User System & Personalization)

🔐 **User Accounts** – Login system with secure profile management.

🧬 **Learning Style Quiz** – Onboarding quiz to analyze learning habits and preferences.

📊 **Adaptive Profiles** – Personalized learning profile that evolves based on progress and interactions.

🧠 **AI-Based Learning Plan Generator** – Calendar-integrated planner that creates study schedules based on exams, goals, and availability.

📅 **Calendar Sync** – Sync with Google Calendar / iOS / device calendars.

🏆 **Milestone & Goal Tracker** – Set learning milestones with smart nudges to change ineffective habits.

🗣️ **Multi-language Support** – Available in English, German, Hungarian (with room for expansion).

🌐 **Community Learning** – Share progress, join group study sessions, and work on projects with friends.

🧘 **Focus Mode** – Distraction-free mode with timers, soundscapes, and pomodoro-style sessions.

📓 **Note-to-Explanation** – Upload notes or text files and let MindPilot explain them.

🧪 **Smart Quiz Generator** – Turn materials into personalized tests, with automatic grading and feedback.

💬 **AI Chat Assistant** – Conversational support for real-time Q&A and tutoring.

📔 **Learning Journal** – Reflective journal that helps you track your mindset and progress.

📁 **Material Import Tools** – Import study content from files, links, or external services.

📚 **Learning Packs** – Curated topic bundles with learning paths and resources.

🚀 **Career Path Recommender** – Get suggestions for academic/career directions based on your strengths and interests.

🎯 **Gamification & Rewards** – XP, achievements, and future community events to keep users engaged.

## 📱 Future Release: Mobile App (v3.0+)

> The mobile version will include all essential features with enhanced support for:
- Image-based note and quiz scanning.
- Voice interaction.
- Daily study reminders and widgets.
- Offline learning.

## 🧩 Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Axios
- **Backend**: FastAPI, Python, Cohere API, dotenv
- **Build Tools**: Node.js, npm, Bash

---

## 📦 Installation and Running

### Backend

1. Create a virtual environment and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate

2. Install depencies:
    ```bash
    pip install -r requirements.txt
    ```
3. Set your Cohere API key in a .env file:
    ```bash
    COHERE_API_KEY=your_api_key_here
    ```
4. Run the FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```
### Frontend

1. Navigate to the frontend folder and install depencies:
    ```bash 
    npm install
    ```

2. Start the development server:
    ```bash 
    npm run dev
    ```

3. Open your browser at:
    ```bash 
    http://localhost:5173
    ```

---

### 🤝 Contributing

We welcome contributions! Feel free to submit pull requests, open issues, or suggest new features.

### License

This project is licensed under the MIT License.

---

Last updated: July 28, 2025



