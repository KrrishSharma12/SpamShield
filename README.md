# SpamShield

> A modern spam message detection experience powered by React, FastAPI, and a trained machine learning model.

[GitHub Repository](https://github.com/KrrishSharma12/SpamShield.git)

## Overview

SpamShield turns spam detection into a clean, fast, and visually engaging experience. Paste a message, run a prediction, and get an instant answer with a polished interface built for clarity and speed.

## Highlights

- Fast spam vs. not-spam detection
- Stylish, responsive dashboard UI
- Live backend prediction endpoint
- Local recent-check history in the browser
- Modern gradient-based visual design

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: FastAPI, Python, joblib
- Model: Serialized spam classifier and vectorizer

## Preview

If you add screenshots later, place them here to showcase the interface.

## Project Structure

```text
SpamDetection/
├── Backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── spam_model.pkl
│   └── vectorizer.pkl
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Features

- Creative hero-style landing section
- Character-limited message input
- Spam result cards with visual feedback
- Detection statistics and recent activity
- Smooth gradients, glass effects, and animations

## Quick Start

### 1. Backend

Open a terminal inside `Backend` and install the Python dependencies:

```bash
pip install -r requirements.txt
```

Run the API server:

```bash
uvicorn app:app --reload
```

The backend will be available at `http://localhost:8000`.

### 2. Frontend

Open a second terminal inside `frontend` and install the Node dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will usually run at `http://localhost:5173`.

## How It Works

1. Enter or paste a message into the input box.
2. The frontend sends the text to `POST /predict`.
3. The backend vectorizes the message and runs the trained spam model.
4. The result is shown instantly in the UI.

## API

### `POST /predict`

Request body:

```json
{
  "text": "Win a free iPhone now"
}
```

Response:

```json
{
  "result": "Spam"
}
```

## Notes

- Ensure `spam_model.pkl` and `vectorizer.pkl` exist in the `Backend` folder.
- The frontend is currently configured to call `http://localhost:8000`.
- CORS is enabled in the backend for local development.




