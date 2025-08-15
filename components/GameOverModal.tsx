"use client"
import UpdateStatsButton from "./UpdateStatsButton"

export default function GameOverModal({
  score,
  miles,
  onClose,
}: {
  score: number
  miles: number
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-white rounded-2xl shadow-xl px-8 py-8 max-w-xs w-full text-center">
        {/* Close (X) button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl font-black mb-2 text-purple-800 tracking-tight">
          🏁 Race Finished!
        </h2>
        <div className="mb-4 mt-3 flex flex-col items-center gap-2">
          <span className="text-lg text-gray-700">
            <b>Score:</b> <span className="font-mono">{score}</span>
          </span>
          <span className="text-lg text-gray-700">
            <b>Miles:</b> <span className="font-mono">{miles}</span>
          </span>
        </div>
        <div className="mb-2">
          <UpdateStatsButton score={score} miles={miles} />
        </div>
        <div className="mt-3">
          <button
            className="w-full mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium text-gray-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
