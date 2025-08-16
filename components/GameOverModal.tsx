"use client";
import UpdateStatsButton from "./UpdateStatsButton";

export default function GameOverModal({
  score,
  miles,
  onClose,
}: {
  score: number;
  miles: number;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(24,16,42,0.85)",
      }}
    >
      <div
        style={{
          position: "relative",
          background: "linear-gradient(135deg, #23143a 65%, #2d194d 100%)",
          border: "2.5px solid #a763e6",
          borderRadius: 22,
          boxShadow: "0 8px 40px #a763e652, 0 1.5px 12px #0006",
          padding: "2.8rem 2.2rem 2.3rem 2.2rem",
          width: "95vw",
          maxWidth: 340,
          color: "#fff",
          textAlign: "center",
          fontFamily: "Orbitron, monospace",
        }}
      >
        {/* Close (X) button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 14,
            right: 18,
            fontSize: 28,
            fontWeight: 900,
            background: "none",
            border: "none",
            color: "#a763e6",
            cursor: "pointer",
            transition: "color 0.19s",
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "#d6adff")}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "#a763e6")}
        >
          &times;
        </button>

        <h2
          style={{
            fontSize: "2.05rem",
            fontWeight: 900,
            marginBottom: "1.2rem",
            letterSpacing: 1.7,
            background: "linear-gradient(90deg, #b07cff 10%, #ffb3e6 80%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 1.5px 10px #b07cff44",
          }}
        >
          🏁 Race Finished!
        </h2>
        <div
          style={{
            marginBottom: "1.1rem",
            marginTop: "0.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.55rem",
            fontFamily: "Orbitron, monospace",
          }}
        >
          <span
            style={{
              fontSize: "1.17rem",
              color: "#e5e1fa",
              letterSpacing: 0.8,
              textShadow: "0 2px 8px #fff2",
            }}
          >
            <b>Score:</b>{" "}
            <span style={{ fontWeight: 800, color: "#b07cff", fontSize: "1.22rem", letterSpacing: 1.2 }}>
              {score}
            </span>
          </span>
          <span
            style={{
              fontSize: "1.17rem",
              color: "#e5e1fa",
              letterSpacing: 0.8,
              textShadow: "0 2px 8px #fff2",
            }}
          >
            <b>Miles:</b>{" "}
            <span style={{ fontWeight: 800, color: "#b07cff", fontSize: "1.22rem", letterSpacing: 1.2 }}>
              {miles}
            </span>
          </span>
        </div>
        <div style={{ marginBottom: 13 }}>
          <UpdateStatsButton score={score} miles={miles} />
        </div>
        <div style={{ marginTop: 14 }}>
          <button
            style={{
              width: "100%",
              padding: "0.95rem 0",
              border: "none",
              borderRadius: 14,
              fontFamily: "Orbitron, monospace",
              fontWeight: 700,
              fontSize: "1.05rem",
              background: "linear-gradient(90deg, #d7a3ff 0%, #b07cff 80%)",
              color: "#221537",
              cursor: "pointer",
              boxShadow: "0 2px 12px #b07cff27",
              letterSpacing: 1.2,
              transition: "background 0.2s",
            }}
            onClick={onClose}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(90deg, #b07cff 0%, #d7a3ff 80%)")}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(90deg, #d7a3ff 0%, #b07cff 80%)")}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
