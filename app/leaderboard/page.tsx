"use client"
import { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { client } from "@/utils/client"

const PROJECT_ADDRESS = process.env.NEXT_PUBLIC_HONEYCOMB_PROJECT_ADDRESS!

export default function LeaderboardPage() {
  const { publicKey } = useWallet()
  const [profiles, setProfiles] = useState<any[]>([])
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<"score" | "miles">("score")
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  // Fetch leaderboard on mount
  useEffect(() => {
    fetchLeaderboard()
    // eslint-disable-next-line
  }, [sortBy])

  async function fetchLeaderboard() {
    setLoading(true)
    setStatus("Fetching leaderboard...")
    try {
      const { profile } = await client.findProfiles({
        projects: [PROJECT_ADDRESS],
        identities: ["main"],
      })
      // Only show profiles with a score or miles
      const filtered = (profile || []).filter((p: any) => p.customData && (p.customData.score || p.customData.miles))
      const leaderboard = filtered.map((p: any) => ({
        username: p.info?.name || "",
        wallet: p.wallets?.[0] || "",
        score: Number(p.customData?.score?.[0] || 0),
        miles: Number(p.customData?.miles?.[0] || 0),
        pfp: p.info?.pfp || "",
      }))
      leaderboard.sort((a, b) => b[sortBy] - a[sortBy])

      const fullLeaderboard = Array.from({ length: 10 }, (_, index) => {
        const actualProfile = leaderboard[index]
        return (
          actualProfile || {
            username: "",
            wallet: "",
            score: 0,
            miles: 0,
            pfp: "",
            isEmpty: true,
          }
        )
      })

      setProfiles(fullLeaderboard)
      setStatus("✅ Leaderboard loaded!")
      setLastFetched(new Date())
    } catch (e: any) {
      setStatus("❌ Error loading leaderboard.")
      setProfiles(
        Array.from({ length: 10 }, () => ({
          username: "",
          wallet: "",
          score: 0,
          miles: 0,
          pfp: "",
          isEmpty: true,
        })),
      )
    }
    setLoading(false)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000000",
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "2rem 1rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              fontWeight: "700",
              margin: "0 0 0.5rem 0",
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            Dash Race Leaderboard
          </h1>
          <p
            style={{
              color: "#888888",
              fontSize: "0.9rem",
              margin: "0",
            }}
          >
            Top 10 racers on Honeycomb
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: loading ? "#333333" : "#1a1a1a",
              color: loading ? "#666666" : "#ffffff",
              border: "1px solid #333333",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: "500",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              ":hover": {
                backgroundColor: loading ? "#333333" : "#2a2a2a",
              },
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.backgroundColor = "#2a2a2a"
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.backgroundColor = "#1a1a1a"
            }}
          >
            {loading ? "Refreshing..." : "🔄 Refresh"}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "0.85rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#888888" }}>Sort by:</span>
            <button
              onClick={() => setSortBy("score")}
              style={{
                padding: "0.4rem 0.8rem",
                backgroundColor: sortBy === "score" ? "#333333" : "#1a1a1a",
                color: sortBy === "score" ? "#ffffff" : "#888888",
                border: "1px solid #333333",
                borderRadius: "6px",
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Score
            </button>
            <button
              onClick={() => setSortBy("miles")}
              style={{
                padding: "0.4rem 0.8rem",
                backgroundColor: sortBy === "miles" ? "#333333" : "#1a1a1a",
                color: sortBy === "miles" ? "#ffffff" : "#888888",
                border: "1px solid #333333",
                borderRadius: "6px",
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Miles
            </button>
          </div>
        </div>

        {status && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              fontSize: "0.9rem",
              color: status.startsWith("✅") ? "#4ade80" : "#f87171",
              fontWeight: "500",
            }}
          >
            {status}
          </div>
        )}

        <div
          style={{
            backgroundColor: "#111111",
            borderRadius: "12px",
            border: "1px solid #222222",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#1a1a1a" }}>
                  <th
                    style={{
                      padding: "1rem 0.75rem",
                      textAlign: "center",
                      fontWeight: "600",
                      color: "#ffffff",
                      borderBottom: "1px solid #333333",
                      width: "60px",
                    }}
                  >
                    Rank
                  </th>
                  <th
                    style={{
                      padding: "1rem 0.75rem",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#ffffff",
                      borderBottom: "1px solid #333333",
                      minWidth: "200px",
                    }}
                  >
                    Player
                  </th>
                  <th
                    style={{
                      padding: "1rem 0.75rem",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#ffffff",
                      borderBottom: "1px solid #333333",
                      minWidth: "120px",
                    }}
                  >
                    Wallet
                  </th>
                  <th
                    style={{
                      padding: "1rem 0.75rem",
                      textAlign: "right",
                      fontWeight: "600",
                      color: "#ffffff",
                      borderBottom: "1px solid #333333",
                      width: "80px",
                    }}
                  >
                    Score
                  </th>
                  <th
                    style={{
                      padding: "1rem 0.75rem",
                      textAlign: "right",
                      fontWeight: "600",
                      color: "#ffffff",
                      borderBottom: "1px solid #333333",
                      width: "80px",
                    }}
                  >
                    Miles
                  </th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p, i) => {
                  const isUser = publicKey && p.wallet && p.wallet === publicKey.toString()
                  const isEmpty = p.isEmpty || (!p.username && !p.wallet)

                  return (
                    <tr
                      key={i}
                      style={{
                        backgroundColor: isUser ? "#1a2e1a" : i % 2 === 0 ? "#0a0a0a" : "#111111",
                        borderBottom: i < 9 ? "1px solid #222222" : "none",
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <td
                        style={{
                          padding: "1rem 0.75rem",
                          textAlign: "center",
                          fontWeight: "600",
                          color: isEmpty ? "#444444" : "#ffffff",
                        }}
                      >
                        {i + 1}
                      </td>
                      <td
                        style={{
                          padding: "1rem 0.75rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          minHeight: "60px",
                        }}
                      >
                        <span
                          style={{
                            color: isEmpty ? "#444444" : "#ffffff",
                            fontStyle: isEmpty ? "italic" : "normal",
                          }}
                        >
                          {isEmpty ? "—" : p.username || "(no name)"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "1rem 0.75rem",
                          fontFamily: "ui-monospace, monospace",
                          fontSize: "0.8rem",
                          color: isEmpty ? "#444444" : "#cccccc",
                        }}
                      >
                        {isEmpty ? (
                          "—"
                        ) : (
                          <>
                            {p.wallet.slice(0, 6)}...{p.wallet.slice(-4)}
                            {isUser && (
                              <span
                                style={{
                                  marginLeft: "0.5rem",
                                  padding: "0.2rem 0.5rem",
                                  backgroundColor: "#2d5a2d",
                                  color: "#4ade80",
                                  borderRadius: "4px",
                                  fontSize: "0.7rem",
                                  fontWeight: "600",
                                }}
                              >
                                You
                              </span>
                            )}
                          </>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "1rem 0.75rem",
                          textAlign: "right",
                          fontWeight: "500",
                          color: isEmpty ? "#444444" : "#ffffff",
                        }}
                      >
                        {isEmpty ? "—" : p.score.toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "1rem 0.75rem",
                          textAlign: "right",
                          fontWeight: "500",
                          color: isEmpty ? "#444444" : "#ffffff",
                        }}
                      >
                        {isEmpty ? "—" : p.miles.toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "0.8rem",
            color: "#666666",
          }}
        >
          Last refreshed: {lastFetched ? lastFetched.toLocaleTimeString() : "Never"}
        </div>
      </main>
    </div>
  )
}
