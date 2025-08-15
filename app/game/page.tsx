"use client"
import { useState } from "react"
import dynamic from "next/dynamic"
import ProfileSetup from "@/components/ProfileSetup"
import { useWallet } from "@solana/wallet-adapter-react"

// Dynamically import PhaserGame to avoid SSR issues
const PhaserGame = dynamic(() => import("@/components/PhaserGame"), { ssr: false })
const GameOverModal = dynamic(() => import("@/components/GameOverModal"), { ssr: false })

export default function GamePage() {
  const [mode, setMode] = useState<null | "play" | "guest">(null)
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [profileReady, setProfileReady] = useState(false)
  const [lastStats, setLastStats] = useState<{ score: number, miles: number } | null>(null)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const { publicKey } = useWallet()

  // You MUST require both wallet AND profile to be ready to play
  const readyToPlay = !!publicKey && profileReady

  if (!mode) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[80vh] relative">
        <h2 className="text-2xl font-mono mb-8">Choose Play Mode</h2>
        <button
          className="mb-4 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-mono text-lg"
          onClick={() => {
            if (readyToPlay) {
              setMode("play")
            } else {
              setShowProfileSetup(true)
            }
          }}
        >
          Play Game
        </button>
        <button
          className="mb-4 px-6 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 font-mono text-lg"
          onClick={() => setMode("guest")}
        >
          Play as Guest
        </button>

        {/* Modal for Profile Setup */}
        {showProfileSetup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
            <div className="relative w-full max-w-lg">
              <ProfileSetup onComplete={() => { setShowProfileSetup(false); setProfileReady(true); setMode("play") }} />
              <button
                className="absolute top-2 right-3 text-white text-2xl"
                onClick={() => setShowProfileSetup(false)}
                aria-label="Close Profile Setup"
              >×</button>
            </div>
          </div>
        )}
      </section>
    )
  }

  // --- Play Mode (with modal on Save & Exit) ---
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh]">
      <PhaserGame
        onExit={() => setMode(null)}
        onSaveAndExit={({ score, miles }) => {
          setLastStats({ score, miles })
          setShowStatsModal(true)
        }}
      />
      {/* Game Over/Update Stats Modal */}
      {showStatsModal && lastStats && (
  <GameOverModal
    score={lastStats.score}
    miles={lastStats.miles}
    onClose={() => {
      setShowStatsModal(false)
      setMode(null)
    }}
    isPaused={showStatsModal}
  />
)}

    </section>
  )
}
