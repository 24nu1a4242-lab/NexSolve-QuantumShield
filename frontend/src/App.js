import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

/* 🔥 LIVE BACKEND URL */
const API_BASE = "https://nexsolve-quantumshield.onrender.com";

/* ---------------- LANDING ---------------- */

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.landing}>
      <h1 style={styles.brand}>🛡 NexSolve</h1>
      <p style={styles.subtitle}>QuantumShield AI Defense Lab</p>
      <button style={styles.primaryBtn} onClick={() => navigate("/dashboard")}>
        Enter Secure Dashboard →
      </button>
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */

function Dashboard() {
  const [dataPoints, setDataPoints] = useState([]);
  const [threatLevel, setThreatLevel] = useState("None");
  const [errorRate, setErrorRate] = useState(0);
  const [aiStatus, setAiStatus] = useState("Normal");
  const [confidence, setConfidence] = useState(0);
  const [autoMode, setAutoMode] = useState(false);

  const simulateAttack = async () => {
    try {
      const res = await fetch(`${API_BASE}/simulate`);
      const data = await res.json();

      setErrorRate(data.error_rate);
      setThreatLevel(data.threat_level);
      setAiStatus(data.ai_status);
      setConfidence(Math.floor(Math.random() * 20) + 80);

      setDataPoints((prev) => [...prev.slice(-9), data.error_rate]);
    } catch (error) {
      console.error("Backend connection error:", error);
    }
  };

  useEffect(() => {
    let interval;
    if (autoMode) {
      interval = setInterval(simulateAttack, 2000);
    }
    return () => clearInterval(interval);
  }, [autoMode]);

  const downloadReport = () => {
    const report = {
      company: "NexSolve QuantumShield",
      threat_level: threatLevel,
      error_rate: errorRate,
      ai_status: aiStatus,
      confidence: confidence,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "NexSolve_Security_Report.json";
    link.click();
  };

  const chartData = {
    labels: dataPoints.map((_, i) => `T${i + 1}`),
    datasets: [
      {
        label: "Quantum Error %",
        data: dataPoints,
        borderColor: "#00ffff",
        backgroundColor: "rgba(0,255,255,0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { labels: { color: "white" } },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <div style={styles.dashboard}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>NexSolve</h2>

        <button style={styles.primaryBtn} onClick={simulateAttack}>
          Simulate Attack
        </button>

        <button style={styles.secondaryBtn} onClick={() => setAutoMode(!autoMode)}>
          {autoMode ? "Stop Live Monitoring" : "Start Live Monitoring"}
        </button>

        <button style={styles.secondaryBtn} onClick={downloadReport}>
          Download Report
        </button>
      </div>

      <div style={styles.main}>
        <h2>Quantum Threat Monitor</h2>

        {threatLevel === "High" && (
          <div style={styles.alertHigh}>🚨 CRITICAL THREAT DETECTED 🚨</div>
        )}

        <div style={styles.statusBox}>
          <p>Error Rate: <b>{errorRate}%</b></p>
          <p>Threat Level: <b>{threatLevel}</b></p>
          <p>AI Status: <b>{aiStatus}</b></p>
          <p>AI Confidence: <b>{confidence}%</b></p>
        </div>

        <div style={{ width: "85%", marginTop: "30px" }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- MAIN APP WRAPPER ---------------- */

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  landing: {
    height: "100vh",
    background: "linear-gradient(135deg, #0f172a, #020617)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  brand: { fontSize: "60px" },
  subtitle: { marginBottom: "40px" },
  dashboard: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "white",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#111827",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  logo: { marginBottom: "30px" },
  main: { flex: 1, padding: "40px" },
  statusBox: {
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
  },
  primaryBtn: {
    padding: "12px",
    marginBottom: "10px",
    background: "#00ffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  secondaryBtn: {
    padding: "10px",
    marginBottom: "10px",
    background: "#1e293b",
    border: "1px solid #00ffff",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },
  alertHigh: {
    padding: "15px",
    marginBottom: "20px",
    backgroundColor: "rgba(255,0,0,0.2)",
    color: "red",
    border: "1px solid red",
    borderRadius: "8px",
  },
};

export default App;