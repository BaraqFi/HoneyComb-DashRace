"use client"
import { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { client } from "@/utils/client"
import bs58 from "bs58"
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers"

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

  // --- Styles and UI remain unchanged below this line ---

  const styles = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    },
    modal: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "24px",
      padding: "48px",
      maxWidth: "480px",
      width: "100%",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      position: "relative" as const,
    },
    header: {
      textAlign: "center" as const,
      marginBottom: "40px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#1a1a2e",
      marginBottom: "8px",
      letterSpacing: "-0.02em",
    },
    subtitle: {
      fontSize: "16px",
      color: "#6b7280",
      fontWeight: "400",
    },
    stepContainer: {
      textAlign: "center" as const,
      minHeight: "200px",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "center",
      alignItems: "center",
    },
    stepTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "24px",
    },
    input: {
      width: "100%",
      padding: "16px 20px",
      fontSize: "16px",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      outline: "none",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
      marginBottom: "24px",
      background: "#ffffff",
    },
    inputFocus: {
      borderColor: "#8b5cf6",
      boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
    },
    button: {
      background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      color: "white",
      border: "none",
      padding: "16px 32px",
      fontSize: "16px",
      fontWeight: "600",
      borderRadius: "12px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
      minWidth: "200px",
      position: "relative" as const,
    },
    buttonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.4)",
    },
    buttonDisabled: {
      background: "#d1d5db",
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "none",
    },
    status: {
      marginTop: "20px",
      padding: "12px 16px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
      textAlign: "center" as const,
    },
    statusSuccess: {
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #bbf7d0",
    },
    statusError: {
      background: "#fef2f2",
      color: "#dc2626",
      border: "1px solid #fecaca",
    },
    statusInfo: {
      background: "#eff6ff",
      color: "#2563eb",
      border: "1px solid #bfdbfe",
    },
    progressBar: {
      width: "100%",
      height: "4px",
      background: "#e5e7eb",
      borderRadius: "2px",
      marginBottom: "32px",
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      background: "linear-gradient(90deg, #8b5cf6, #7c3aed)",
      borderRadius: "2px",
      transition: "width 0.3s ease",
    },
    stepIndicator: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px",
      marginBottom: "32px",
    },
    stepDot: {
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      background: "#e5e7eb",
      transition: "all 0.2s ease",
    },
    stepDotActive: {
      background: "#8b5cf6",
      transform: "scale(1.2)",
    },
    stepDotComplete: {
      background: "#10b981",
    },
    loadingSpinner: {
      width: "20px",
      height: "20px",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderTop: "2px solid white",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginRight: "8px",
    },
  }

  const getProgress = () => {
    switch (currentStep) {
      case "username":
        return 0
      case "createUser":
        return 25
      case "authenticate":
        return 50
      case "createProfile":
        return 75
      case "complete":
        return 100
      default:
        return 0
    }
  }

  const getStepStatus = (step: string) => {
    const steps = ["username", "createUser", "authenticate", "createProfile"]
    const currentIndex = steps.indexOf(currentStep)
    const stepIndex = steps.indexOf(step)

    if (stepIndex < currentIndex) return "complete"
    if (stepIndex === currentIndex) return "active"
    return "inactive"
  }

  return (
    <div style={styles.container}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={styles.modal}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome to Dash Race</h1>
          <p style={styles.subtitle}>Set up your gaming profile to get started</p>
        </div>

        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${getProgress()}%` }} />
        </div>

        <div style={styles.stepIndicator}>
          {["username", "createUser", "authenticate", "createProfile"].map((step, index) => {
            const status = getStepStatus(step)
            return (
              <div
                key={step}
                style={{
                  ...styles.stepDot,
                  ...(status === "active" ? styles.stepDotActive : {}),
                  ...(status === "complete" ? styles.stepDotComplete : {}),
                }}
              />
            )
          })}
        </div>

        <div style={styles.stepContainer}>
          {currentStep === "checking" && (
            <div className="w-full text-center text-purple-300 py-8 font-semibold text-lg min-h-[120px]">
              Checking for existing profile...
            </div>
          )}

          {currentStep === "username" && (
            <>
              <h2 style={styles.stepTitle}>Choose Your Username</h2>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your gaming username"
                maxLength={30}
                style={styles.input}
                onKeyPress={(e) => e.key === "Enter" && handleUsernameSubmit()}
                autoFocus
              />
              <button
                onClick={handleUsernameSubmit}
                disabled={!username.trim()}
                style={{
                  ...styles.button,
                  ...(username.trim() ? {} : styles.buttonDisabled),
                }}
              >
                Continue
              </button>
            </>
          )}

          {currentStep === "createUser" && (
            <>
              <h2 style={styles.stepTitle}>Create Your Account</h2>
              <p style={{ color: "#6b7280", marginBottom: "24px", fontSize: "14px" }}>
                Hello <strong>{username}</strong>! Let's create your blockchain account.
              </p>
              <button
                onClick={createUser}
                disabled={loading || !wallet.publicKey}
                style={{
                  ...styles.button,
                  ...(loading || !wallet.publicKey ? styles.buttonDisabled : {}),
                }}
              >
                {loading && <div style={styles.loadingSpinner} />}
                Create User
              </button>
            </>
          )}

          {currentStep === "authenticate" && (
            <>
              <h2 style={styles.stepTitle}>Authenticate Your Account</h2>
              <p style={{ color: "#6b7280", marginBottom: "24px", fontSize: "14px" }}>
                Sign a message to verify your identity and secure your account.
              </p>
              <button
                onClick={authenticateUser}
                disabled={loading || !wallet.publicKey}
                style={{
                  ...styles.button,
                  ...(loading || !wallet.publicKey ? styles.buttonDisabled : {}),
                }}
              >
                {loading && <div style={styles.loadingSpinner} />}
                Authenticate User
              </button>
            </>
          )}

          {currentStep === "createProfile" && (
            <>
              <h2 style={styles.stepTitle}>Create Game Profile</h2>
              <p style={{ color: "#6b7280", marginBottom: "24px", fontSize: "14px" }}>
                Final step! Create your gaming profile to start racing.
              </p>
              <button
                onClick={createProfile}
                disabled={loading || !accessToken || !username}
                style={{
                  ...styles.button,
                  ...(loading || !accessToken || !username ? styles.buttonDisabled : {}),
                }}
              >
                {loading && <div style={styles.loadingSpinner} />}
                Create Game Profile
              </button>
            </>
          )}

          {currentStep === "complete" && (
            <>
              <h2 style={styles.stepTitle}>🎉 Setup Complete!</h2>
              <p style={{ color: "#6b7280", marginBottom: "24px", fontSize: "14px" }}>
                Welcome to Dash Race, <strong>{username}</strong>! Your profile is ready.
              </p>
              <div
                style={{
                  background: "#dcfce7",
                  color: "#166534",
                  padding: "16px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                ✅ Game launching...
              </div>
            </>
          )}
        </div>

        {status && (
          <div
            style={{
              ...styles.status,
              ...(status.startsWith("✅")
                ? styles.statusSuccess
                : status.startsWith("❌")
                  ? styles.statusError
                  : styles.statusInfo),
            }}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  )
}
