from fastapi import FastAPI
from pydantic import BaseModel
import joblib
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("spam_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

class Message(BaseModel):
    text: str

@app.post("/predict")
def predict(msg: Message):
    msg_vector = vectorizer.transform([msg.text])
    prediction = model.predict(msg_vector)

    return {
        "result": "Spam" if prediction[0] == 1 else "Not Spam"
    }