"use client";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative"
      style={{
        background: "linear-gradient(135deg, #151A2B 0%, #1a1a2e 48%, #16213e 100%)",
        color: "#fff",
        fontFamily: "Orbitron, monospace",
      }}
    >
      {/* Back button (top left) */}
      <Link href="/" className="absolute top-8 sm:top-10 left-8 sm:left-10 z-10 no-underline">
        <button
          className="bg-transparent border-2 border-[#b07cff] rounded-lg text-[#b07cff] font-bold text-sm sm:text-base md:text-lg px-4 sm:px-6 py-2 sm:py-3 cursor-pointer transition-all duration-200 outline-none"
          style={{
            fontFamily: "Orbitron",
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
        className="bg-[rgba(32,18,54,0.93)] border-2 border-[#b07cff] rounded-2xl min-w-[280px] sm:min-w-[320px] md:min-w-[420px] max-w-[690px] w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[45vw] min-h-[170px] flex flex-col justify-center items-center shadow-lg"
        style={{
          boxShadow: "0 2px 24px #b07cff35",
        }}
      >
        <div
          className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-center tracking-[1.1px] w-full p-6 sm:p-8 md:p-12"
          style={{
            fontFamily: "Orbitron",
            color: "#c6baff",
          }}
        >
          Profile Data Coming Soon.
          <div
            className="font-normal text-[#b07cff] text-sm sm:text-base md:text-lg lg:text-xl mt-3 sm:mt-4 tracking-[1px]"
          >
            Stay Tuned
          </div>
        </div>
      </div>
    </div>
  );
}
