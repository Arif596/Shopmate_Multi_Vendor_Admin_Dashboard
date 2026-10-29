import { useState, useEffect } from "react";

const API = "http://localhost:4000";

const DbToggle = () => {
  const [mode, setMode] = useState("local");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/db-mode`)
      .then((r) => r.json())
      .then((d) => setMode(d.mode))
      .catch(() => {});
  }, []);

  const toggle = async () => {
    const next = mode === "local" ? "live" : "local";
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/db-mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: next }),
      });
      const data = await res.json();
      setMode(data.mode);
      window.location.reload(); // naye database ka data dobara load karne ke liye
    } catch (e) {
      console.log("Mode switch failed", e);
    }
    setLoading(false);
  };

  const isLive = mode === "live";

  return (
    <button
      onClick={toggle}
      disabled={loading}
      style={{
        padding: "6px 14px",
        borderRadius: "999px",
        border: "none",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "13px",
        color: "#fff",
        background: isLive ? "#16a34a" : "#6b7280",
      }}
    >
      {isLive ? "🟢 Live (Neon)" : "⚪ Local"}
    </button>
  );
};

export default DbToggle;