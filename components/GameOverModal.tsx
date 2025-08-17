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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(24,16,42,0.85)] p-2 sm:p-4"
    >
      <div
        className="relative bg-gradient-to-br from-[#23143a] to-[#2d194d] border-2 border-[#a763e6] rounded-3xl shadow-lg p-4 sm:p-6 md:p-8 w-[95vw] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-white text-center"
        style={{
          boxShadow: "0 8px 40px #a763e652, 0 1.5px 12px #0006",
          fontFamily: "Orbitron, monospace",
        }}
      >
        {/* Close (X) button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 sm:top-3 right-3 sm:right-4 text-xl sm:text-2xl font-black bg-transparent border-none text-[#a763e6] cursor-pointer transition-colors duration-200"
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "#d6adff")}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "#a763e6")}
        >
          &times;
        </button>

        <h2
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black mb-3 sm:mb-4 tracking-[1.7px]"
          style={{
            background: "linear-gradient(90deg, #b07cff 10%, #ffb3e6 80%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 1.5px 10px #b07cff44",
          }}
        >
          🏁 Race Finished!
        </h2>
        <div
          className="mb-3 sm:mb-4 mt-1 flex flex-col items-center gap-2 sm:gap-3"
          style={{
            fontFamily: "Orbitron, monospace",
          }}
        >
          <span
            className="text-sm sm:text-base md:text-lg lg:text-xl text-[#e5e1fa] tracking-[0.8px]"
            style={{
              textShadow: "0 2px 8px #fff2",
            }}
          >
            <b>Score:</b>{" "}
            <span className="font-extrabold text-[#b07cff] text-base sm:text-lg md:text-xl lg:text-2xl tracking-[1.2px]">
              {score}
            </span>
          </span>
          <span
            className="text-sm sm:text-base md:text-lg lg:text-xl text-[#e5e1fa] tracking-[0.8px]"
            style={{
              textShadow: "0 2px 8px #fff2",
            }}
          >
            <b>Miles:</b>{" "}
            <span className="font-extrabold text-[#2bdafe] text-base sm:text-lg md:text-xl lg:text-2xl tracking-[1.2px]">
              {miles}
            </span>
          </span>
        </div>
        <div className="mb-4 sm:mb-6">
          <UpdateStatsButton score={score} miles={miles} />
        </div>
        <button
          onClick={onClose}
          className="w-full font-bold text-sm sm:text-base md:text-lg uppercase py-2 sm:py-3 tracking-[1.8px] cursor-pointer transition-all duration-200 outline-none rounded-xl"
          style={{
            background: "linear-gradient(90deg, #a763e6 0%, #b07cff 100%)",
            border: "none",
            color: "#fff",
            fontFamily: "Orbitron",
            boxShadow: "0 4px 20px #a763e645",
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
