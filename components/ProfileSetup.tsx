"use client";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "@/utils/client";
import bs58 from "bs58";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";

// --- Accent colors
const accent = "#a763e6";
const accent2 = "#d7a3ff";
const accentText = "#c6baff";
const cardBg = "rgba(40, 18, 54, 0.97)";

export default function ProfileSetup({ onComplete }: { onComplete?: () => void }) {
  const wallet = useWallet()
  const projectAddr = process.env.NEXT_PUBLIC_HONEYCOMB_PROJECT_ADDRESS!
  const profileTreeAddr = process.env.NEXT_PUBLIC_HONEYCOMB_PROFILE_TREE!
  const [accessToken, setAccessToken] = useState("")
  const [userAddr, setUserAddr] = useState("")
  const [userId, setUserId] = useState<number | null>(null)
  const [profileAddr, setProfileAddr] = useState("")
  const [username, setUsername] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<
    "checking" | "username" | "createUser" | "authenticate" | "createProfile" | "complete"
  >("checking")

  // ---- AUTO-DETECT USER & PROFILE ON WALLET CHANGE ----
  useEffect(() => {
    if (!wallet.publicKey) return
    setCurrentStep("checking")
    setStatus("Checking for existing account...")

    client.findUsers({ wallets: [wallet.publicKey.toString()] })
      .then(async ({ user }) => {
        if (user && user.length > 0) {
          setUserAddr(user[0].address)
          setUserId(user[0].id)
          // Check for profile
          const { profile } = await client.findProfiles({
            userIds: [user[0].id],
            projects: [projectAddr],
            identities: ["main"],
          })
          if (profile && profile.length > 0) {
            setProfileAddr(profile[0].address)
            setUsername(profile[0].info?.name || "")
            setStatus("✅ Profile found. You’re ready!")
            setCurrentStep("complete")
            setTimeout(() => {
              if (onComplete) onComplete()
            }, 700)
          } else {
            setStatus("")
            setCurrentStep("username")
          }
        } else {
          setStatus("")
          setCurrentStep("username")
        }
      })
      .catch((e) => {
        setStatus("Error checking Honeycomb user: " + e.message)
        setCurrentStep("username")
      })
    // eslint-disable-next-line
  }, [wallet.publicKey, projectAddr])

  async function createUser() {
    if (!wallet.publicKey) return setStatus("Connect your wallet first!")
    setLoading(true)
    setStatus("Creating Honeycomb user...")
    try {
      const { createNewUserTransaction: txResponse } = await client.createNewUserTransaction({
        wallet: wallet.publicKey.toString(),
        info: {
          name: "Dash Racer",
          pfp: "https://placekitten.com/100/100",
          bio: "Dash Race game player",
        },
        payer: wallet.publicKey.toString(),
      })
      await sendClientTransactions(client, wallet, txResponse)
      setStatus("✅ User transaction sent. Waiting for indexing...")
      setTimeout(fetchUser, 2000)
    } catch (e) {
      setStatus("❌ User creation failed.")
      console.error(e)
      setLoading(false)
    }
  }

  async function fetchUser() {
    if (!wallet.publicKey) return setStatus("Connect wallet!")
    setStatus("Looking up user...")
    try {
      const { user } = await client.findUsers({
        wallets: [wallet.publicKey.toString()],
      })
      if (user && user.length > 0) {
        setUserAddr(user[0].address)
        setUserId(user[0].id)
        setStatus(`✅ User found: ${user[0].address}`)
        setCurrentStep("authenticate")
        setLoading(false)
      } else {
        setStatus("No user found yet, try again soon.")
        setTimeout(fetchUser, 2000)
      }
    } catch (e) {
      setStatus("❌ Error finding user.")
      console.error(e)
      setLoading(false)
    }
  }

  async function authenticateUser() {
    if (!wallet.publicKey || !wallet.signMessage) return setStatus("Wallet/signMessage not ready!")
    setLoading(true)
    setStatus("Authenticating...")
    try {
      const {
        authRequest: { message },
      } = await client.authRequest({ wallet: wallet.publicKey.toString() })
      const signed = await wallet.signMessage(new TextEncoder().encode(message))
      const signature = bs58.encode(signed)
      const { authConfirm } = await client.authConfirm({ wallet: wallet.publicKey.toString(), signature })
      setAccessToken(authConfirm.accessToken)
      setStatus("✅ Authenticated! Token ready.")
      setCurrentStep("createProfile")
    } catch (e) {
      setStatus("❌ Authentication failed.")
      console.error(e)
    }
    setLoading(false)
  }

  async function createProfile() {
    if (!wallet.publicKey || !projectAddr || !profileTreeAddr || !username || !accessToken)
      return setStatus("Connect wallet, authenticate, and enter username!")
    setLoading(true)
    setStatus("Creating game profile...")
    try {
      const { createNewProfileTransaction: txResponse } = await client.createNewProfileTransaction(
        {
          project: projectAddr,
          payer: wallet.publicKey.toString(),
          identity: "main",
          info: {
            name: username,
            bio: "Dash Race player",
            pfp: "https://placekitten.com/150/150",
          },
        },
        {
          fetchOptions: {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          },
        },
      )
      await sendClientTransactions(client, wallet, txResponse)
      setStatus("✅ Profile transaction sent. Waiting for indexing...")
      setTimeout(fetchProfile, 2000)
    } catch (e) {
      setStatus("❌ Profile creation failed.")
      console.error(e)
      setLoading(false)
    }
  }

  async function fetchProfile() {
    if (!userId || !projectAddr) return setStatus("Need userId & project addresses!")
    setStatus("Looking up profile...")
    try {
      const { profile } = await client.findProfiles({
        userIds: [userId],
        projects: [projectAddr],
        identities: ["main"],
      })
      if (profile && profile.length > 0) {
        setProfileAddr(profile[0].address)
        setStatus(`✅ Profile found: ${profile[0].address}`)
        setCurrentStep("complete")
        setLoading(false)
        if (onComplete) onComplete()
      } else {
        setStatus("No profile found yet, try again soon.")
        setTimeout(fetchProfile, 2000)
      }
    } catch (e) {
      setStatus("❌ Error finding profile.")
      console.error(e)
      setLoading(false)
    }
  }

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      setCurrentStep("createUser")
    }
  }

  // --- Styles for our UI theme ---
  const getProgress = () => {
    switch (currentStep) {
      case "username": return 0;
      case "createUser": return 25;
      case "authenticate": return 50;
      case "createProfile": return 75;
      case "complete": return 100;
      default: return 0;
    }
  };
  const getStepStatus = (step: string) => {
    const steps = ["username", "createUser", "authenticate", "createProfile"];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);
    if (stepIndex < currentIndex) return "complete";
    if (stepIndex === currentIndex) return "active";
    return "inactive";
  };

  return (
    <div style={{
      fontFamily: "Orbitron, monospace",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #21152e 0%, #381c4a 65%, #2e1848 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <style jsx>{`
        @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
      `}</style>
      <div style={{
        background: cardBg,
        border: `2.5px solid ${accent}`,
        borderRadius: 22,
        boxShadow: `0 8px 40px ${accent}44, 0 2px 16px #0006`,
        padding: "2.7rem 2rem 2.1rem 2rem",
        maxWidth: 420,
        width: "100%",
        color: "#fff",
        position: "relative",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{
            fontSize: "2rem",
            fontWeight: 900,
            marginBottom: 8,
            background: `linear-gradient(90deg, ${accent} 10%, ${accent2} 80%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 2,
            textShadow: `0 1.5px 10px ${accent}44`
          }}>
            Welcome to Dash Race
          </h1>
          <p style={{
            fontSize: 15,
            color: accentText,
            fontWeight: 500,
            opacity: 0.92,
            letterSpacing: 1,
            marginTop: 4,
          }}>Set up your gaming profile to get started</p>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: "100%",
          height: 5,
          background: "#2d183c",
          borderRadius: 2,
          marginBottom: 22,
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            background: `linear-gradient(90deg, ${accent2}, ${accent})`,
            borderRadius: 2,
            width: `${getProgress()}%`,
            transition: "width 0.3s",
          }} />
        </div>

        {/* Step dots */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 14,
          marginBottom: 24,
        }}>
          {["username", "createUser", "authenticate", "createProfile"].map((step, idx) => {
            const status = getStepStatus(step);
            return (
              <div key={step}
                style={{
                  width: 15, height: 15, borderRadius: "50%",
                  background: status === "complete"
                    ? "#10b981"
                    : status === "active"
                      ? accent
                      : "#47355c",
                  border: status === "active" ? `2.2px solid ${accent2}` : "none",
                  boxShadow: status === "active" ? `0 2px 10px ${accent2}55` : undefined,
                  transform: status === "active" ? "scale(1.18)" : undefined,
                  transition: "all 0.2s",
                }}
              />
            )
          })}
        </div>

        <div style={{
          minHeight: 128,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center"
        }}>
          {currentStep === "checking" && (
            <div style={{ color: accent2, fontWeight: 700, fontSize: "1.07rem", padding: "2.5rem 0" }}>
              Checking for existing profile...
            </div>
          )}

          {currentStep === "username" && (
            <>
              <h2 style={{
                fontSize: "1.3rem",
                fontWeight: 800,
                color: accent,
                marginBottom: 17,
                letterSpacing: 1.1,
              }}>Choose Your Username</h2>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your gaming username"
                maxLength={30}
                style={{
                  width: "100%",
                  padding: "0.9rem 1.1rem",
                  fontSize: "1.04rem",
                  border: `2.2px solid ${accent}`,
                  borderRadius: 13,
                  outline: "none",
                  fontFamily: "Orbitron, monospace",
                  background: "#201832",
                  color: "#fff",
                  marginBottom: 22,
                  letterSpacing: 0.6,
                }}
                onKeyPress={e => e.key === "Enter" && handleUsernameSubmit()}
                autoFocus
              />
              <button
                onClick={handleUsernameSubmit}
                disabled={!username.trim()}
                style={{
                  width: "100%",
                  background: `linear-gradient(90deg, ${accent2} 0%, ${accent} 100%)`,
                  color: "#1b0f28",
                  border: "none",
                  padding: "1.1rem 0",
                  fontSize: "1.11rem",
                  fontWeight: 700,
                  borderRadius: 13,
                  cursor: username.trim() ? "pointer" : "not-allowed",
                  boxShadow: username.trim() ? `0 4px 16px ${accent2}23` : "none",
                  fontFamily: "Orbitron, monospace",
                  opacity: username.trim() ? 1 : 0.7,
                  letterSpacing: 1.1,
                  marginBottom: 6,
                }}
              >
                Continue
              </button>
            </>
          )}

          {currentStep === "createUser" && (
            <>
              <h2 style={{
                fontSize: "1.23rem", fontWeight: 800, color: accent, marginBottom: 13, letterSpacing: 1.1
              }}>Create Your Account</h2>
              <p style={{
                color: accentText, fontWeight: 500, opacity: 0.88, marginBottom: 21, fontSize: "0.98rem"
              }}>
                Hello <strong>{username}</strong>! Let's create your blockchain account.
              </p>
              <button
                onClick={createUser}
                disabled={loading || !wallet.publicKey}
                style={{
                  width: "100%",
                  background: `linear-gradient(90deg, ${accent2} 0%, ${accent} 100%)`,
                  color: "#1b0f28",
                  border: "none",
                  padding: "1.1rem 0",
                  fontSize: "1.07rem",
                  fontWeight: 700,
                  borderRadius: 13,
                  cursor: loading || !wallet.publicKey ? "not-allowed" : "pointer",
                  fontFamily: "Orbitron, monospace",
                  opacity: loading || !wallet.publicKey ? 0.6 : 1,
                  letterSpacing: 1.1,
                  boxShadow: loading || !wallet.publicKey ? "none" : `0 4px 16px ${accent2}1a`,
                }}
              >
                {loading &&
                  <span style={{
                    width: 18, height: 18, border: "2px solid #eee2", borderTop: `2px solid ${accent2}`, borderRadius: "50%", display: "inline-block", marginRight: 7, animation: "spin 1s linear infinite"
                  }} />}
                Create User
              </button>
            </>
          )}

          {currentStep === "authenticate" && (
            <>
              <h2 style={{
                fontSize: "1.23rem", fontWeight: 800, color: accent, marginBottom: 13, letterSpacing: 1.1
              }}>Authenticate Your Account</h2>
              <p style={{
                color: accentText, fontWeight: 500, opacity: 0.88, marginBottom: 21, fontSize: "0.98rem"
              }}>
                Sign a message to verify your identity and secure your account.
              </p>
              <button
                onClick={authenticateUser}
                disabled={loading || !wallet.publicKey}
                style={{
                  width: "100%",
                  background: `linear-gradient(90deg, ${accent2} 0%, ${accent} 100%)`,
                  color: "#1b0f28",
                  border: "none",
                  padding: "1.1rem 0",
                  fontSize: "1.07rem",
                  fontWeight: 700,
                  borderRadius: 13,
                  cursor: loading || !wallet.publicKey ? "not-allowed" : "pointer",
                  fontFamily: "Orbitron, monospace",
                  opacity: loading || !wallet.publicKey ? 0.6 : 1,
                  letterSpacing: 1.1,
                  boxShadow: loading || !wallet.publicKey ? "none" : `0 4px 16px ${accent2}1a`,
                }}
              >
                {loading &&
                  <span style={{
                    width: 18, height: 18, border: "2px solid #eee2", borderTop: `2px solid ${accent2}`, borderRadius: "50%", display: "inline-block", marginRight: 7, animation: "spin 1s linear infinite"
                  }} />}
                Authenticate User
              </button>
            </>
          )}

          {currentStep === "createProfile" && (
            <>
              <h2 style={{
                fontSize: "1.23rem", fontWeight: 800, color: accent, marginBottom: 13, letterSpacing: 1.1
              }}>Create Game Profile</h2>
              <p style={{
                color: accentText, fontWeight: 500, opacity: 0.88, marginBottom: 21, fontSize: "0.98rem"
              }}>
                Final step! Create your gaming profile to start racing.
              </p>
              <button
                onClick={createProfile}
                disabled={loading || !accessToken || !username}
                style={{
                  width: "100%",
                  background: `linear-gradient(90deg, ${accent2} 0%, ${accent} 100%)`,
                  color: "#1b0f28",
                  border: "none",
                  padding: "1.1rem 0",
                  fontSize: "1.07rem",
                  fontWeight: 700,
                  borderRadius: 13,
                  cursor: loading || !accessToken || !username ? "not-allowed" : "pointer",
                  fontFamily: "Orbitron, monospace",
                  opacity: loading || !accessToken || !username ? 0.6 : 1,
                  letterSpacing: 1.1,
                  boxShadow: loading || !accessToken || !username ? "none" : `0 4px 16px ${accent2}1a`,
                }}
              >
                {loading &&
                  <span style={{
                    width: 18, height: 18, border: "2px solid #eee2", borderTop: `2px solid ${accent2}`, borderRadius: "50%", display: "inline-block", marginRight: 7, animation: "spin 1s linear infinite"
                  }} />}
                Create Game Profile
              </button>
            </>
          )}

          {currentStep === "complete" && (
            <>
              <h2 style={{
                fontSize: "1.18rem", fontWeight: 800, color: "#38d273", marginBottom: 15, letterSpacing: 1.1
              }}>🎉 Setup Complete!</h2>
              <p style={{
                color: accentText, fontWeight: 500, opacity: 0.95, marginBottom: 18, fontSize: "1.04rem"
              }}>
                Welcome to Dash Race, <strong>{username}</strong>! Your profile is ready.
              </p>
              <div style={{
                background: "#dcfce7",
                color: "#166534",
                padding: "1.02rem",
                borderRadius: "12px",
                fontSize: "1.07rem",
                fontWeight: 700,
                fontFamily: "Orbitron, monospace",
                letterSpacing: 1.05,
              }}>
                ✅ Game launching...
              </div>
            </>
          )}
        </div>

        {/* Status messages */}
        {status && (
          <div style={{
            marginTop: 22,
            padding: "13px 17px",
            borderRadius: 10,
            fontSize: "1.01rem",
            fontWeight: 600,
            textAlign: "center",
            background: status.startsWith("✅")
              ? "#273e29"
              : status.startsWith("❌")
                ? "#4a2323"
                : "#23183b",
            color: status.startsWith("✅")
              ? "#38d273"
              : status.startsWith("❌")
                ? "#ff7676"
                : accent,
            border: status.startsWith("✅")
              ? "1.6px solid #38d273"
              : status.startsWith("❌")
                ? "1.6px solid #ff7676"
                : `1.6px solid ${accent2}`,
            boxShadow: status.startsWith("✅")
              ? "0 2px 10px #38d27333"
              : status.startsWith("❌")
                ? "0 2px 10px #ff767633"
                : "0 2px 10px #b07cff33",
            marginBottom: 8,
          }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
