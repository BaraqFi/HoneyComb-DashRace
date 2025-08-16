"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import ProfileSetup from "@/components/ProfileSetup";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

// Dynamically import PhaserGame to avoid SSR issues
const PhaserGame = dynamic(() => import("@/components/PhaserGame"), { ssr: false });
const GameOverModal = dynamic(() => import("@/components/GameOverModal"), { ssr: false });

const deepRed = "#b0273a";
const deeperRed = "#7d1d2a";
const darkRedGradient = "linear-gradient(90deg, #a30c29 0%, #b0273a 100%)";
const borderRed = "#a30c29";

export default function GamePage() {
  const [mode, setMode] = useState<null | "play" | "guest">(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const [lastStats, setLastStats] = useState<{ score: number, miles: number } | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const { publicKey } = useWallet();

  const readyToPlay = !!publicKey && profileReady;

  if (!mode) {
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: "linear-gradient(135deg, #19141a 0%, #27181c 60%, #3c0a13 100%)",
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
              border: `2.1px solid ${borderRed}`,
              borderRadius: 11,
              color: borderRed,
              fontFamily: "Orbitron",
              fontWeight: 700,
              fontSize: "1.1rem",
              padding: "0.91rem 2.2rem",
              cursor: "pointer",
              transition: "all 0.22s",
              outline: "none",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = borderRed;
              (e.currentTarget as HTMLButtonElement).style.color = "#fff";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0)";
              (e.currentTarget as HTMLButtonElement).style.color = borderRed;
            }}
          >
            ← Back
          </button>
        </Link>
        <div
          style={{
            background: "rgba(40, 8, 20, 0.97)",
            border: `2.5px solid ${borderRed}`,
            borderRadius: 18,
            minWidth: 410,
            maxWidth: 530,
            width: "90vw",
            minHeight: 180,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 2px 24px #b0273a35",
            padding: "3rem 1.3rem 2.2rem 1.3rem",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontFamily: "Orbitron",
              fontWeight: 800,
              color: deepRed,
              marginBottom: "2.1rem",
              textAlign: "center",
              letterSpacing: 2,
              marginTop: 0,
              textShadow: "0 0 8px #b0273a77, 0 1px 20px #5a152a55",
            }}
          >
            Choose Play Mode
          </h2>
          <button
            style={{
              width: "100%",
              background: darkRedGradient,
              border: "none",
              borderRadius: 14,
              color: "#fff",
              fontFamily: "Orbitron",
              fontWeight: 700,
              fontSize: "1.13rem",
              textTransform: "uppercase",
              padding: "1.13rem 0",
              boxShadow: "0 4px 24px #b0273a30",
              letterSpacing: 2,
              cursor: "pointer",
              transition: "all 0.21s",
              outline: "none",
              marginBottom: "1.3rem",
            }}
            onClick={() => {
              if (readyToPlay) {
                setMode("play");
              } else {
                setShowProfileSetup(true);
              }
            }}
          >
            Play Game
          </button>
          <button
            style={{
              width: "100%",
              background: "rgba(0,0,0,0)",
              border: `2.4px solid ${borderRed}`,
              borderRadius: 14,
              color: borderRed,
              fontFamily: "Orbitron",
              fontWeight: 700,
              fontSize: "1.09rem",
              textTransform: "uppercase",
              padding: "1.13rem 0",
              letterSpacing: 1.9,
              cursor: "pointer",
              transition: "all 0.2s",
              outline: "none",
              marginBottom: "0.3rem",
            }}
            onClick={() => setMode("guest")}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = borderRed;
              (e.currentTarget as HTMLButtonElement).style.color = "#fff";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0)";
              (e.currentTarget as HTMLButtonElement).style.color = borderRed;
            }}
          >
            Play as Guest
          </button>
        </div>

        {/* Modal for Profile Setup */}
        {showProfileSetup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
            <div className="relative w-full max-w-lg">
              <ProfileSetup
                onComplete={() => {
                  setShowProfileSetup(false);
                  setProfileReady(true);
                  setMode("play");
                }}
              />
              <button
                className="absolute top-2 right-3 text-white text-2xl"
                onClick={() => setShowProfileSetup(false)}
                aria-label="Close Profile Setup"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- Play Mode (with modal on Save & Exit) ---
  return (
    <section
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #19141a 0%, #27181c 60%, #3c0a13 100%)",
        color: "#fff",
        fontFamily: "Orbitron, monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PhaserGame
        onExit={() => setMode(null)}
        onSaveAndExit={({ score, miles }) => {
          setLastStats({ score, miles });
          setShowStatsModal(true);
        }}
      />
      {/* Game Over/Update Stats Modal */}
      {showStatsModal && lastStats && (
        <GameOverModal
          score={lastStats.score}
          miles={lastStats.miles}
          onClose={() => {
            setShowStatsModal(false);
            setMode(null);
          }}
          isPaused={showStatsModal}
        />
      )}
    </section>
  );
}
