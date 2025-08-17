"use client"

import Link from "next/link"
import dynamic from "next/dynamic"

// Import your wallet connect component (replace with your actual import path)
const WalletConnect = dynamic(() => import("@/components/WalletConnect"), { ssr: false });

export default function HomePage() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative"
      style={{
        background: 'linear-gradient(135deg, #151A2B 0%, #1a1a2e 48%, #16213e 100%)',
        fontFamily: 'Orbitron, monospace',
      }}
    >
      {/* Title */}
      <div className="text-center mb-8">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-[#2bdafe] tracking-[5px] m-0"
          style={{
            textShadow: '0 0 12px #35caff, 0 1px 32px #1a8be6, 0 2px 6px #19a6d5',
          }}
        >
          DASH RACE
        </h1>
        <div
          className="text-sm sm:text-base md:text-lg lg:text-xl font-normal tracking-[1.5px] text-[#d8eafd] opacity-93 mt-3 mb-1"
          style={{
            textShadow: '0 0 8px #21a5f5bb',
          }}
        >
          Endless Racing Adventure
        </div>
      </div>
      
      {/* 2x2 Button Grid */}
      <div className="flex flex-col items-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl gap-4 sm:gap-5 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full">
          <Link href="/game" className="flex-1">
            <button
              className="w-full font-bold text-xs sm:text-sm md:text-base lg:text-lg uppercase py-3 sm:py-4 md:py-5 tracking-[2.1px] cursor-pointer transition-all duration-200 outline-none rounded-xl"
              style={{
                background: 'linear-gradient(90deg, #2bdafe 0%, #18bfff 100%)',
                border: 'none',
                color: '#fff',
                fontFamily: 'Orbitron',
                boxShadow: '0 4px 24px #18bfff45',
              }}
            >
              START GAME
            </button>
          </Link>
          <Link href="/tasks" className="flex-1">
            <button
              className="w-full font-bold text-xs sm:text-sm md:text-base lg:text-lg uppercase py-3 sm:py-4 md:py-5 tracking-[2.1px] cursor-pointer transition-all duration-200 outline-none rounded-xl"
              style={{
                background: 'linear-gradient(90deg, #232de4 0%, #28eef3 100%)',
                border: 'none',
                color: '#fff',
                fontFamily: 'Orbitron',
              }}
            >
              MISSIONS
            </button>
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full">
          <Link href="/leaderboard" className="flex-1">
            <button
              className="w-full font-bold text-xs sm:text-sm md:text-base lg:text-lg uppercase py-3 sm:py-4 md:py-5 tracking-[1.9px] cursor-pointer transition-all duration-200 outline-none rounded-xl"
              style={{
                background: 'rgba(0,0,0,0)',
                border: '2.4px solid #2bdafe',
                color: '#2bdafe',
                fontFamily: 'Orbitron',
              }}
            >
              LEADERBOARD
            </button>
          </Link>
          <Link href="/profile" className="flex-1">
            <button
              className="w-full font-bold text-xs sm:text-sm md:text-base lg:text-lg uppercase py-3 sm:py-4 md:py-5 tracking-[2px] cursor-pointer transition-all duration-200 outline-none rounded-xl"
              style={{
                background: 'linear-gradient(90deg, #ffac2b 0%, #f7e13e 100%)',
                border: 'none',
                color: '#191c1f',
                fontFamily: 'Orbitron',
              }}
            >
              PROFILE
            </button>
          </Link>
        </div>
        <div className="w-full flex justify-center mt-5 sm:mt-6">
          <WalletConnect />
        </div>
      </div>
      
      {/* Instructions */}
      <div
        className="absolute bottom-5 sm:bottom-6 left-1/2 transform -translate-x-1/2 text-center text-white opacity-78 font-normal text-xs sm:text-sm md:text-base leading-tight tracking-[1.1px] px-4"
        style={{
          fontFamily: 'VT323, monospace',
        }}
      >
        <span role="img">🏁</span> Collect coins (+10) &nbsp;•&nbsp; Avoid obstacles (-30) &nbsp;•&nbsp; Dodge missiles (-60)
        <br />
        <span role="img">🎮</span> Tap left/right of your car to change lanes
      </div>
    </div>
  );
}
