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
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #151A2B 0%, #1a1a2e 48%, #16213e 100%)",
        color: "#ffffff",
        fontFamily: "Orbitron, monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        justifyContent: "flex-start",
      }}
    >
      {/* Back button */}
      <Link href="/" style={{ textDecoration: "none", position: "absolute", left: 38, top: 34 }}>
        <button
          style={{
            background: "rgba(0,0,0,0)",
            border: "2.1px solid #2bdafe",
            borderRadius: 11,
            color: "#2bdafe",
            fontFamily: "Orbitron",
            fontWeight: 700,
            fontSize: "1.1rem",
            padding: "0.91rem 2.2rem",
            cursor: "pointer",
            transition: "all 0.22s",
            outline: "none",
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
      <div style={{ marginTop: 54, marginBottom: 9, textAlign: "center" }}>
        <h2
          style={{
            fontSize: "3.2rem",
            fontFamily: "Orbitron",
            fontWeight: 900,
            color: "#ffd700",
            margin: 0,
            letterSpacing: 5,
            textShadow: "0 0 18px #ffd70088, 0 1px 12px #ffd70050",
          }}
        >
          LEADERBOARD
        </h2>
        <div
          style={{
            fontFamily: "Orbitron",
            fontWeight: 400,
            fontSize: "1.15rem",
            color: "#e3dcb3",
            opacity: 0.97,
            marginTop: 10,
            marginBottom: 3,
            textShadow: "0 0 7px #ffd70044",
          }}
        >
          Top Racers of All Time
        </div>
      </div>
      {/* Controls */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "1.2rem",
          marginBottom: "1.5rem",
          fontFamily: "Orbitron",
          fontWeight: 500,
          fontSize: "1.03rem",
        }}
      >
        <button
          onClick={fetchLeaderboard}
          disabled={loading}
          style={{
            padding: "0.75rem 1.5rem",
            background: loading ? "#333333" : "linear-gradient(90deg, #ffd700 0%, #f7e13e 100%)",
            color: loading ? "#b2b2b2" : "#191c1f",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 1px 6px #ffe55633",
            outline: "none",
            transition: "all 0.2s ease",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
        <span style={{ color: "#ffd700", fontWeight: 500 }}>Sort by:</span>
        <button
          onClick={() => setSortBy("score")}
          style={{
            padding: "0.4rem 1.1rem",
            background: sortBy === "score" ? "#ffd700" : "#191c1f",
            color: sortBy === "score" ? "#191c1f" : "#ffd700",
            border: "2px solid #ffd700",
            borderRadius: "6px",
            fontSize: "0.97rem",
            fontWeight: 700,
            cursor: "pointer",
            outline: "none",
            transition: "all 0.17s",
          }}
        >
          Score
        </button>
        <button
          onClick={() => setSortBy("miles")}
          style={{
            padding: "0.4rem 1.1rem",
            background: sortBy === "miles" ? "#ffd700" : "#191c1f",
            color: sortBy === "miles" ? "#191c1f" : "#ffd700",
            border: "2px solid #ffd700",
            borderRadius: "6px",
            fontSize: "0.97rem",
            fontWeight: 700,
            cursor: "pointer",
            outline: "none",
            transition: "all 0.17s",
          }}
        >
          Miles
        </button>
      </div>
      {/* Leaderboard Box */}
      <div
        style={{
          background: "rgba(10,12,19,0.93)",
          border: "2.5px solid #ffd700",
          borderRadius: 18,
          minWidth: 420,
          maxWidth: 690,
          width: "45vw",
          minHeight: 170,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 24px #ffe55621",
          marginBottom: "2rem",
        }}
      >
        {/* Table header */}
        <div
          style={{
            color: "#ffd700",
            fontWeight: 700,
            fontSize: "1.14rem",
            display: "grid",
            gridTemplateColumns: "75px 1fr 120px 120px",
            gap: "0.5rem",
            padding: "1.1rem 0 1rem 0",
            borderBottom: "2px solid #ffd700",
            marginBottom: 8,
            textAlign: "center",
            letterSpacing: 1.4,
            width: "100%",
          }}
        >
          <div>RANK</div>
          <div>USER</div>
          <div>SCORE</div>
          <div>MILES</div>
        </div>
        {/* Table rows */}
        {profiles.length === 0 ? (
          <div
            style={{
              fontFamily: "Orbitron",
              color: "#e7e5ce",
              fontSize: "1.1rem",
              textAlign: "center",
              padding: "3rem 0",
              letterSpacing: 1.1,
              width: "100%",
            }}
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
                style={{
                  display: "grid",
                  gridTemplateColumns: "75px 1fr 120px 120px",
                  gap: "0.5rem",
                  padding: "0.88rem 0",
                  borderBottom: i < 9 ? "1.3px solid #222" : "none",
                  fontSize: "1.05rem",
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
                    fontWeight: 900,
                    textAlign: "center",
                    fontSize: "1.12rem",
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
                    : `#${i + 1}`}
                </div>
                <div
                  style={{
                    color: isEmpty ? "#494849" : "#fff",
                    fontFamily: "Orbitron",
                    fontWeight: 600,
                    fontSize: "1.08rem",
                    textAlign: "left",
                    paddingLeft: "0.5rem",
                  }}
                >
                  {isEmpty ? "—" : p.username || "(no name)"}
                </div>
                <div
                  style={{
                    color: isEmpty ? "#494849" : "#ffd700",
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: "1.08rem",
                  }}
                >
                  {isEmpty ? "—" : p.score.toLocaleString()}
                </div>
                <div
                  style={{
                    color: isEmpty ? "#494849" : "#2bdafe",
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: "1.08rem",
                  }}
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
        style={{
          marginTop: "0.7rem",
          textAlign: "center",
          fontSize: "1.03rem",
          color: status.startsWith("✅")
            ? "#4ade80"
            : status.startsWith("❌")
            ? "#f87171"
            : "#e3e3e3",
          fontWeight: "500",
          fontFamily: "Orbitron",
          marginBottom: "1.7rem",
        }}
      >
        {status}
        <div style={{ color: "#b1b2b7", fontWeight: 400, fontSize: "0.97rem", marginTop: 7 }}>
          Last refreshed: {lastFetched ? lastFetched.toLocaleTimeString() : "Never"}
        </div>
      </div>
    </div>
  );
}
