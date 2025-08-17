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
        className="min-h-screen w-full flex flex-col items-center justify-center relative"
        style={{
          background: "linear-gradient(135deg, #19141a 0%, #27181c 60%, #3c0a13 100%)",
          color: "#fff",
          fontFamily: "Orbitron, monospace",
        }}
      >
        {/* Back button (top left) */}
        <Link href="/" className="absolute top-8 sm:top-10 left-8 sm:left-10 z-10 no-underline">
          <button
            className="bg-transparent border-2 border-[#a30c29] rounded-lg text-[#a30c29] font-bold text-sm sm:text-base md:text-lg px-4 sm:px-6 py-2 sm:py-3 cursor-pointer transition-all duration-200 outline-none"
            style={{
              fontFamily: "Orbitron",
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
          className="bg-[rgba(40,8,20,0.97)] border-2 border-[#a30c29] rounded-2xl min-w-[280px] sm:min-w-[320px] md:min-w-[410px] max-w-[530px] w-[90vw] min-h-[180px] mx-auto flex flex-col justify-center items-center shadow-lg p-6 sm:p-8 md:p-12"
          style={{
            boxShadow: "0 2px 24px #b0273a35",
          }}
        >
          <h2
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#b0273a] mb-6 sm:mb-8 text-center tracking-[2px] mt-0"
            style={{
              fontFamily: "Orbitron",
              textShadow: "0 0 8px #b0273a77, 0 1px 20px #5a152a55",
            }}
          >
            Choose Your Mode
          </h2>
          <div className="flex flex-col gap-4 sm:gap-5 w-full max-w-sm sm:max-w-md">
            <button
              className="w-full font-bold text-sm sm:text-base md:text-lg uppercase py-3 sm:py-4 tracking-[1.9px] cursor-pointer transition-all duration-200 outline-none rounded-xl"
              style={{
                background: darkRedGradient,
                border: "none",
                color: "#fff",
                fontFamily: "Orbitron",
              }}
              onClick={() => {
                if (readyToPlay) {
                  setMode("play");
                } else if (publicKey) {
                  setShowProfileSetup(true);
                }
              }}
            >
              Play Game
            </button>
            <button
              className="w-full font-bold text-sm sm:text-base md:text-lg uppercase py-3 sm:py-4 tracking-[1.9px] cursor-pointer transition-all duration-200 outline-none rounded-xl mb-1"
              style={{
                background: "rgba(0,0,0,0)",
                border: "2.4px solid #a30c29",
                color: "#a30c29",
                fontFamily: "Orbitron",
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
            <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
              <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
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
      </div>
    );
  }

  // --- Play Mode (with modal on Save & Exit) ---
  return (
    <section
      className="min-h-screen w-full flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #19141a 0%, #27181c 60%, #3c0a13 100%)",
        color: "#fff",
        fontFamily: "Orbitron, monospace",
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
        />
      )}
    </section>
  );
}
