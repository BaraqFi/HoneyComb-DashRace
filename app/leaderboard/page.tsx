"use client";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "@/utils/client";
import Link from "next/link";

const PROJECT_ADDRESS = process.env.NEXT_PUBLIC_HONEYCOMB_PROJECT_ADDRESS!;

export default function LeaderboardPage() {
  const { publicKey } = useWallet();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"score" | "miles">("score");
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line
  }, [sortBy]);

  async function fetchLeaderboard() {
    setLoading(true);
    setStatus("Fetching leaderboard...");
    try {
      const { profile } = await client.findProfiles({
        projects: [PROJECT_ADDRESS],
        identities: ["main"],
      });
      const filtered = (profile || []).filter(
        (p: any) => p.customData && (p.customData.score || p.customData.miles)
      );
      const leaderboard = filtered.map((p: any) => ({
        username: p.info?.name || "",
        wallet: p.wallets?.[0] || "",
        score: Number(p.customData?.score?.[0] || 0),
        miles: Number(p.customData?.miles?.[0] || 0),
        pfp: p.info?.pfp || "",
      }));
      leaderboard.sort((a, b) => b[sortBy] - a[sortBy]);
      const fullLeaderboard = Array.from({ length: 10 }, (_, index) => {
        const actualProfile = leaderboard[index];
        return (
          actualProfile || {
            username: "",
            wallet: "",
            score: 0,
            miles: 0,
            pfp: "",
            isEmpty: true,
          }
        );
      });

      setProfiles(fullLeaderboard);
      setStatus("✅ Leaderboard loaded!");
      setLastFetched(new Date());
    } catch (e: any) {
      setStatus("❌ Error loading leaderboard.");
      setProfiles(
        Array.from({ length: 10 }, () => ({
          username: "",
          wallet: "",
          score: 0,
          miles: 0,
          pfp: "",
          isEmpty: true,
        }))
      );
    }
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center relative justify-start"
      style={{
        background: "linear-gradient(135deg, #151A2B 0%, #1a1a2e 48%, #16213e 100%)",
        color: "#ffffff",
        fontFamily: "Orbitron, monospace",
      }}
    >
      {/* Back button */}
      <Link href="/" className="no-underline absolute left-8 sm:left-10 top-8 sm:top-10 z-10">
        <button
          className="bg-transparent border-2 border-[#2bdafe] rounded-lg text-[#2bdafe] font-bold text-sm sm:text-base md:text-lg px-4 sm:px-6 py-2 sm:py-3 cursor-pointer transition-all duration-200 outline-none"
          style={{
            fontFamily: "Orbitron",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "#2bdafe";
            (e.currentTarget as HTMLButtonElement).style.color = "#171e31";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0)";
            (e.currentTarget as HTMLButtonElement).style.color = "#2bdafe";
          }}
        >
          ← Back
        </button>
      </Link>
      {/* Header */}
      <div className="mt-12 sm:mt-14 md:mt-16 mb-2 sm:mb-3 text-center">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-[#ffd700] m-0 tracking-[5px]"
          style={{
            fontFamily: "Orbitron",
            textShadow: "0 0 18px #ffd70088, 0 1px 12px #ffd70050",
          }}
        >
          LEADERBOARD
        </h2>
        <div
          className="font-normal text-sm sm:text-base md:text-lg lg:text-xl text-[#e3dcb3] opacity-97 mt-2 sm:mt-3 mb-1"
          style={{
            fontFamily: "Orbitron",
            textShadow: "0 0 7px #ffd70044",
          }}
        >
          Top Racers of All Time
        </div>
      </div>
      {/* Controls */}
      <div
        className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 mb-6 sm:mb-8 font-medium text-sm sm:text-base md:text-lg"
        style={{
          fontFamily: "Orbitron",
        }}
      >
        <button
          onClick={fetchLeaderboard}
          disabled={loading}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm sm:text-base font-bold cursor-pointer transition-all duration-200 outline-none"
          style={{
            background: loading ? "#333333" : "linear-gradient(90deg, #ffd700 0%, #f7e13e 100%)",
            color: loading ? "#b2b2b2" : "#191c1f",
            boxShadow: "0 1px 6px #ffe55633",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
        <span className="text-[#ffd700] font-medium">Sort by:</span>
        <button
          onClick={() => setSortBy("score")}
          className="px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base font-bold cursor-pointer transition-all duration-200 outline-none"
          style={{
            background: sortBy === "score" ? "#ffd700" : "#191c1f",
            color: sortBy === "score" ? "#191c1f" : "#ffd700",
            border: "2px solid #ffd700",
            borderRadius: "6px",
          }}
        >
          Score
        </button>
        <button
          onClick={() => setSortBy("miles")}
          className="px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base font-bold cursor-pointer transition-all duration-200 outline-none"
          style={{
            background: sortBy === "miles" ? "#ffd700" : "#191c1f",
            color: sortBy === "miles" ? "#191c1f" : "#ffd700",
            border: "2px solid #ffd700",
            borderRadius: "6px",
          }}
        >
          Miles
        </button>
      </div>
      {/* Leaderboard Box */}
      <div
        className="bg-opacity-93 bg-[#0a0c13] border border-[#ffd700] rounded-2xl min-w-[280px] max-w-full sm:min-w-[300px] sm:max-w-[450px] w-full sm:w-4/5 min-h-[170px] mx-auto flex flex-col justify-center items-center box-shadow-[0_2px_24px_#ffe55621] mb-8"
      >
        {/* Table header */}
        <div
          className="text-[#ffd700] font-bold text-lg sm:text-xl grid grid-cols-4 gap-2 sm:gap-3 px-3 sm:px-4 py-1 sm:py-1.5 border-b border-[#ffd700] mb-2 text-center letter-spacing-1.4"
        >
          <div>RANK</div>
          <div>USER</div>
          <div>SCORE</div>
          <div>MILES</div>
        </div>
        {/* Table rows */}
        {profiles.length === 0 ? (
          <div
            className="font-orbitron text-[#e7e5ce] text-base sm:text-lg text-center py-6"
          >
            No scores yet. Be the first to play!
          </div>
        ) : (
          profiles.map((p, i) => {
            const isUser = publicKey && p.wallet && p.wallet === publicKey.toString();
            const isEmpty = p.isEmpty || (!p.username && !p.wallet);

            return (
              <div
                key={i}
                className="grid grid-cols-4 gap-2 sm:gap-3 px-3 sm:px-4 py-1 sm:py-1.5 border-b border-[#222] last:border-none"
              >
                <div
                  className="text-center font-bold text-lg sm:text-xl"
                >
                  {isEmpty
                    ? "—"
                    : i === 0
                    ? "🥇"
                    : i === 1
                    ? "🥈"
                    : i === 2
                    ? "🥉"
                    : `#${i + 1}`}
                </div>
                <div
                  className="text-left font-orbitron font-semibold text-base sm:text-lg"
                >
                  {isEmpty ? "—" : p.username || "(no name)"}
                </div>
                <div
                  className="text-right font-bold text-base sm:text-lg"
                >
                  {isEmpty ? "—" : p.score.toLocaleString()}
                </div>
                <div
                  className="text-right font-bold text-base sm:text-lg"
                >
                  {isEmpty ? "—" : p.miles.toLocaleString()}
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Status and last refreshed */}
      <div
        className="mt-1.5 sm:mt-2 text-center font-medium text-sm sm:text-base"
        style={{
          color: status.startsWith("✅")
            ? "#4ade80"
            : status.startsWith("❌")
            ? "#f87171"
            : "#e3e3e3",
          fontFamily: "Orbitron",
          marginBottom: "1.7rem",
        }}
      >
        {status}
        <div className="text-[#b1b2b7] font-normal text-xs sm:text-sm mt-1.5">
          Last refreshed: {lastFetched ? lastFetched.toLocaleTimeString() : "Never"}
        </div>
      </div>
    </div>
  );
}
