from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
import numpy as np
from sklearn.ensemble import IsolationForest

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Train AI anomaly model
X_train = np.random.normal(50, 15, (200, 1))
model = IsolationForest(contamination=0.2, random_state=42)
model.fit(X_train)

attack_history = []

@app.get("/")
def root():
    return {"message": "Quantum AI Backend Running"}

@app.get("/simulate")
def simulate():
    error_rate = random.randint(1, 100)
    prediction = model.predict([[error_rate]])

    ai_status = "Anomaly Detected" if prediction[0] == -1 else "Normal"

    if error_rate < 30:
        threat = "Low"
    elif error_rate < 70:
        threat = "Medium"
    else:
        threat = "High"

    attack = {
        "error_rate": error_rate,
        "threat_level": threat,
        "ai_status": ai_status
    }

    attack_history.append(attack)

    if len(attack_history) > 20:
        attack_history.pop(0)

    return attack

@app.get("/history")
def history():
    return attack_history

@app.delete("/clear")
def clear_history():
    attack_history.clear()
    return {"message": "History cleared"}