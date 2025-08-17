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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(24,16,42,0.85)] p-4"
    >
      <div
        className="relative bg-gradient-to-br from-[#23143a] to-[#2d194d] border-2 border-[#a763e6] rounded-3xl shadow-lg p-6 sm:p-8 md:p-10 w-[95vw] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-white text-center"
        style={{
          boxShadow: "0 8px 40px #a763e652, 0 1.5px 12px #0006",
          fontFamily: "Orbitron, monospace",
        }}
      >
        {/* Close (X) button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 sm:top-4 right-4 sm:right-5 text-2xl sm:text-3xl font-black bg-transparent border-none text-[#a763e6] cursor-pointer transition-colors duration-200"
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "#d6adff")}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "#a763e6")}
        >
          &times;
        </button>

        <h2
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-4 sm:mb-5 tracking-[1.7px]"
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
          className="mb-4 sm:mb-5 mt-2 flex flex-col items-center gap-2 sm:gap-3"
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
        <div className="mb-6 sm:mb-8">
          <UpdateStatsButton score={score} miles={miles} />
        </div>
        <button
          onClick={onClose}
          className="w-full font-bold text-sm sm:text-base md:text-lg uppercase py-3 sm:py-4 tracking-[1.8px] cursor-pointer transition-all duration-200 outline-none rounded-xl"
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
