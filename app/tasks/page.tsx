"use client";
import Link from "next/link";

export default function TasksPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #151A2B 0%, #1a1a2e 48%, #16213e 100%)",
        color: "#fff",
        fontFamily: "Orbitron, monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Back button (top left) */}
      <Link href="/" style={{ position: "absolute", top: 36, left: 38, textDecoration: "none" }}>
        <button
          style={{
            background: "rgba(0,0,0,0)",
            border: "2.1px solid #b07cff",
            borderRadius: 11,
            color: "#b07cff",
            fontFamily: "Orbitron",
            fontWeight: 700,
            fontSize: "1.1rem",
            padding: "0.91rem 2.2rem",
            cursor: "pointer",
            transition: "all 0.22s",
            outline: "none",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "#b07cff";
            (e.currentTarget as HTMLButtonElement).style.color = "#171e31";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0)";
            (e.currentTarget as HTMLButtonElement).style.color = "#b07cff";
          }}
        >
          ← Back
        </button>
      </Link>
      <div
        style={{
          background: "rgba(32, 18, 54, 0.93)",
          border: "2.5px solid #b07cff",
          borderRadius: 18,
          minWidth: 420,
          maxWidth: 690,
          width: "45vw",
          minHeight: 170,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 24px #b07cff35",
        }}
      >
        <div
          style={{
            fontFamily: "Orbitron",
            color: "#c6baff",
            fontWeight: 700,
            fontSize: "1.5rem",
            textAlign: "center",
            padding: "3.1rem 1rem 1rem 1rem",
            letterSpacing: 1.1,
            width: "100%",
          }}
        >
          No Missions Yet.
          <div
            style={{
              fontWeight: 400,
              color: "#b07cff",
              fontSize: "1.13rem",
              marginTop: "0.8rem",
              letterSpacing: 1,
            }}
          >
            Ready Your Fuel
          </div>
        </div>
      </div>
    </div>
  );
}
