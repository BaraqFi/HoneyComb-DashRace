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
      <Link href="/" className="no-underline absolute left-2 sm:left-4 md:left-6 top-2 sm:top-4 md:top-6 z-10">
        <button
          className="bg-transparent border-2 border-[#2bdafe] rounded-lg text-[#2bdafe] font-bold text-xs sm:text-sm md:text-lg px-2 sm:px-3 md:px-6 py-1 sm:py-2 md:py-3 cursor-pointer transition-all duration-200 outline-none"
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
      <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 mb-1 sm:mb-2 md:mb-3 text-center">
        <h2
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-[#ffd700] m-0 tracking-[3px] sm:tracking-[5px]"
          style={{
            fontFamily: "Orbitron",
            textShadow: "0 0 18px #ffd70088, 0 1px 12px #ffd70050",
          }}
        >
          LEADERBOARD
        </h2>
        <div
          className="font-normal text-xs sm:text-sm md:text-base lg:text-lg text-[#e3dcb3] opacity-97 mt-1 sm:mt-2 md:mt-3 mb-1"
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
        className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 md:gap-3 lg:gap-5 mb-2 sm:mb-3 md:mb-4 lg:mb-6 font-medium text-xs sm:text-sm md:text-base"
        style={{
          fontFamily: "Orbitron",
        }}
      >
        <button
          onClick={fetchLeaderboard}
          disabled={loading}
          className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md text-xs sm:text-sm md:text-base font-bold cursor-pointer transition-all duration-200 outline-none"
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
          className="px-1 sm:px-2 md:px-3 py-1 rounded-md text-xs sm:text-sm md:text-base font-bold cursor-pointer transition-all duration-200 outline-none"
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
          className="px-1 sm:px-2 md:px-3 py-1 rounded-md text-xs sm:text-sm md:text-base font-bold cursor-pointer transition-all duration-200 outline-none"
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
        className="bg-opacity-93 bg-[#0a0c13] border border-[#ffd700] rounded-2xl min-w-[280px] max-w-full sm:min-w-[300px] sm:max-w-[450px] w-full sm:w-4/5 min-h-[120px] sm:min-h-[140px] md:min-h-[160px] mx-auto flex flex-col justify-center items-center box-shadow-[0_2px_24px_#ffe55621] mb-2 sm:mb-4 md:mb-6"
      >
        {/* Table header */}
        <div
          className="text-[#ffd700] font-bold text-sm sm:text-base md:text-lg grid grid-cols-4 gap-1 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 border-b border-[#ffd700] mb-1 sm:mb-2 text-center letter-spacing-1.4"
        >
          <div>RANK</div>
          <div>PLAYER</div>
          <div>SCORE</div>
          <div>MILES</div>
        </div>

        {profiles.length === 0 ? (
          <div
            className="font-orbitron text-[#e7e5ce] text-sm sm:text-base md:text-lg text-center py-4 sm:py-6"
          >
            No scores yet. Be the first to play!
          </div>
        ) : (
          <div className="w-full">
            {profiles.map((p, i) => {
              const isEmpty = p.isEmpty;
              const isUser = publicKey && p.wallet === publicKey.toString();
              return (
                <div
                  key={i}
                  className="grid grid-cols-4 gap-1 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 border-b border-[#222] last:border-none"
                  style={{
                    fontSize: "0.9rem",
                    alignItems: "center",
                    width: "100%",
                    background: isUser
                      ? "#212e19"
                      : i % 2 === 0
                      ? "#181c23"
                      : "#131622",
                    transition: "background-color 0.22s",
                  }}
                >
                  <div
                    className="text-center font-bold text-sm sm:text-base md:text-lg"
                    style={{
                      color: isEmpty
                        ? "#494849"
                        : i === 0
                        ? "#ffd700"
                        : i === 1
                        ? "#c0c0c0"
                        : i === 2
                        ? "#cd7f32"
                        : "#fff",
                    }}
                  >
                    {isEmpty
                      ? "—"
                      : i === 0
                      ? "🥇"
                      : i === 1
                      ? "🥈"
                      : i === 2
                      ? "🥉"
                      : `${i + 1}`}
                  </div>
                  <div
                    className="text-left font-orbitron font-semibold text-xs sm:text-sm md:text-base"
                    style={{
                      color: isEmpty ? "#494849" : "#fff",
                    }}
                  >
                    {isEmpty ? "—" : p.username || "(no name)"}
                  </div>
                  <div
                    className="text-right font-bold text-xs sm:text-sm md:text-base"
                    style={{
                      color: isEmpty ? "#494849" : "#ffd700",
                    }}
                  >
                    {isEmpty ? "—" : p.score.toLocaleString()}
                  </div>
                  <div
                    className="text-right font-bold text-xs sm:text-sm md:text-base"
                    style={{
                      color: isEmpty ? "#494849" : "#2bdafe",
                    }}
                  >
                    {isEmpty ? "—" : p.miles.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Status and last refreshed */}
      <div
        className="mt-1 sm:mt-1.5 md:mt-2 text-center font-medium text-xs sm:text-sm md:text-base"
        style={{
          color: status.startsWith("✅")
            ? "#4ade80"
            : status.startsWith("❌")
            ? "#f87171"
            : "#e3e3e3",
          fontFamily: "Orbitron",
          marginBottom: "1rem",
        }}
      >
        {status}
        <div className="text-[#b1b2b7] font-normal text-xs sm:text-sm mt-1">
          Last refreshed: {lastFetched ? lastFetched.toLocaleTimeString() : "Never"}
        </div>
      </div>
    </div>
  );
}
