# MindPilot

An AI-powered study assistant that helps you focus, understand topics deeply, and track your learning progress.

---

## 🚀 MindPilot 1.0 - AI Study Assistant (MVP Release)

### Features:
- AI-generated topic explanations
- Subject and detail level selection for explanations
- Save and review explanations on a History page (using localStorage)
- Clean, markdown-formatted explanations rendered safely
- Multi-page React frontend with routing (Main page and History)
- Stable FastAPI backend integrated with Cohere API
- Responsive, icon-enhanced design with dark mode detection
- Download explanations as text files

---

## 📅 Roadmap – MindPilot 2.0 and Future Enhancements

### Enhanced Intelligent Learning Experience
- 🎯 Pomodoro timer and focus session management
- 📄 Document upload support (PDFs, notes) with AI-generated summaries
- 💬 Interactive Q&A chatbot mode for active learning
- 📊 Progress tracking and detailed statistics dashboard

### Personalized Learning
- 🧠 AI-powered learning style detection and adaptation
- 🗓️ Smart calendar integration for exams and study block scheduling
- 📝 Test generator to check knowledge retention
- 🌐 Multi-language interface and multilingual learning support

### Visualizations and Community Features
- 🔗 Topic relationship and concept mapping visualizations
- 📚 AI-based topic recommendation system
- 👥 Study groups, collaborative projects, shared focus timers

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

Last updated: June 24, 2025



