"use client"

import Link from "next/link"
import dynamic from "next/dynamic"

// Import your wallet connect component (replace with your actual import path)
const WalletConnect = dynamic(() => import("@/components/WalletConnect"), { ssr: false });

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        background: 'linear-gradient(135deg, #151A2B 0%, #1a1a2e 48%, #16213e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Orbitron, monospace',
        position: 'relative',
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <h1
          style={{
            fontFamily: 'Orbitron',
            fontWeight: 900,
            fontSize: '4.2rem',
            color: '#2bdafe',
            letterSpacing: 5,
            textShadow: '0 0 12px #35caff, 0 1px 32px #1a8be6, 0 2px 6px #19a6d5',
            margin: 0,
          }}
        >
          DASH RACE
        </h1>
        <div
          style={{
            fontFamily: 'Orbitron',
            fontWeight: 400,
            fontSize: '1.25rem',
            letterSpacing: 1.5,
            color: '#d8eafd',
            opacity: 0.93,
            marginTop: 11,
            marginBottom: 3,
            textShadow: '0 0 8px #21a5f5bb',
          }}
        >
          Endless Racing Adventure
        </div>
      </div>
      {/* 2x2 Button Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 400, gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 18, width: '100%' }}>
          <Link href="/game" style={{ flex: 1 }}>
            <button
              style={{
                width: '100%',
                background: 'linear-gradient(90deg, #2bdafe 0%, #18bfff 100%)',
                border: 'none',
                borderRadius: 14,
                color: '#fff',
                fontFamily: 'Orbitron',
                fontWeight: 700,
                fontSize: '1.16rem',
                textTransform: 'uppercase',
                padding: '1.13rem 0',
                boxShadow: '0 4px 24px #18bfff45',
                letterSpacing: 2.1,
                cursor: 'pointer',
                transition: 'all 0.21s',
                outline: 'none',
              }}
            >
              START GAME
            </button>
          </Link>
          <Link href="/tasks" style={{ flex: 1 }}>
            <button
              style={{
                width: '100%',
                background: 'linear-gradient(90deg, #232de4 0%, #28eef3 100%)',
                border: 'none',
                borderRadius: 14,
                color: '#fff',
                fontFamily: 'Orbitron',
                fontWeight: 700,
                fontSize: '1.12rem',
                textTransform: 'uppercase',
                padding: '1.13rem 0',
                letterSpacing: 2.1,
                cursor: 'pointer',
                transition: 'all 0.21s',
                outline: 'none',
              }}
            >
              MISSIONS
            </button>
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 18, width: '100%' }}>
          <Link href="/leaderboard" style={{ flex: 1 }}>
            <button
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0)',
                border: '2.4px solid #2bdafe',
                borderRadius: 14,
                color: '#2bdafe',
                fontFamily: 'Orbitron',
                fontWeight: 700,
                fontSize: '1.08rem',
                textTransform: 'uppercase',
                padding: '1.13rem 0',
                letterSpacing: 1.9,
                cursor: 'pointer',
                transition: 'all 0.2s',
                outline: 'none',
              }}
            >
              LEADERBOARD
            </button>
          </Link>
          <Link href="/profile" style={{ flex: 1 }}>
            <button
              style={{
                width: '100%',
                background: 'linear-gradient(90deg, #ffac2b 0%, #f7e13e 100%)',
                border: 'none',
                borderRadius: 14,
                color: '#191c1f',
                fontFamily: 'Orbitron',
                fontWeight: 700,
                fontSize: '1.11rem',
                textTransform: 'uppercase',
                padding: '1.13rem 0',
                letterSpacing: 2,
                cursor: 'pointer',
                transition: 'all 0.21s',
                outline: 'none',
              }}
            >
              PROFILE
            </button>
          </Link>
        </div>
        <div style={{ width: '100%', marginTop: 20, display: 'flex', justifyContent: 'center' }}>
          <WalletConnect />
        </div>
      </div>
      {/* Instructions */}
      <div
        style={{
          position: 'absolute',
          bottom: 21,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          color: '#fff',
          opacity: 0.78,
          fontFamily: 'VT323, monospace',
          fontWeight: 400,
          fontSize: '1.08rem',
          lineHeight: 1.18,
          letterSpacing: 1.1,
        }}
      >
        <span role="img">🏁</span> Collect coins (+10) &nbsp;•&nbsp; Avoid obstacles (-30) &nbsp;•&nbsp; Dodge missiles (-60)
        <br />
        <span role="img">🎮</span> Tap left/right of your car to change lanes
      </div>
    </div>
  );
}
