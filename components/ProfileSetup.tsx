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
    <div className="font-orbitron min-h-screen bg-gradient-to-br from-[#21152e] via-[#381c4a] to-[#2e1848] flex items-center justify-center p-2 sm:p-4">
      <style jsx>{`
        @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
      `}</style>
      <div className="bg-[rgba(40,18,54,0.97)] border-2 border-[#a763e6] rounded-3xl shadow-lg p-4 sm:p-6 md:p-8 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full text-white relative"
        style={{
          boxShadow: `0 8px 40px ${accent}44, 0 2px 16px #0006`,
        }}>
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black mb-2 sm:mb-3 tracking-[2px]"
            style={{
              background: `linear-gradient(90deg, ${accent} 10%, ${accent2} 80%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: `0 1.5px 10px ${accent}44`
            }}>
            Welcome to Dash Race
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#c6baff] font-medium opacity-92 tracking-[1px] mt-1 sm:mt-2">
            Set up your gaming profile to get started
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 sm:h-1.5 bg-[#2d183c] rounded mb-3 sm:mb-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#d7a3ff] to-[#a763e6] rounded transition-all duration-300"
            style={{
              width: `${getProgress()}%`,
            }} />
        </div>

        {/* Step dots */}
        <div className="flex justify-center items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          {["username", "createUser", "authenticate", "createProfile"].map((step, idx) => {
            const status = getStepStatus(step);
            return (
              <div key={step}
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-200"
                style={{
                  background: status === "complete"
                    ? "#10b981"
                    : status === "active"
                      ? accent
                      : "#47355c",
                  border: status === "active" ? `2.2px solid ${accent2}` : "none",
                  boxShadow: status === "active" ? `0 2px 10px ${accent2}55` : undefined,
                  transform: status === "active" ? "scale(1.18)" : undefined,
                }}
              />
            )
          })}
        </div>

        <div className="min-h-24 sm:min-h-28 flex flex-col items-center text-center">
          {currentStep === "checking" && (
            <div className="text-[#d7a3ff] font-bold text-sm sm:text-base md:text-lg py-6 sm:py-8">
              Checking for existing profile...
            </div>
          )}

          {currentStep === "username" && (
            <>
              <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-[#a763e6] mb-3 sm:mb-4 tracking-[1.1px]">
                Choose Your Username
              </h2>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your gaming username"
                maxLength={30}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base md:text-lg border-2 border-[#a763e6] rounded-xl outline-none font-orbitron bg-[#201832] text-white mb-3 sm:mb-4 tracking-[0.6px]"
                onKeyPress={e => e.key === "Enter" && handleUsernameSubmit()}
                autoFocus
              />
              <button
                onClick={handleUsernameSubmit}
                disabled={!username.trim()}
                className="w-full bg-gradient-to-r from-[#d7a3ff] to-[#a763e6] text-[#1b0f28] border-none py-2 sm:py-3 text-sm sm:text-base md:text-lg font-bold rounded-xl cursor-pointer font-orbitron tracking-[1.1px] mb-1"
                style={{
                  cursor: username.trim() ? "pointer" : "not-allowed",
                  boxShadow: username.trim() ? `0 4px 16px ${accent2}23` : "none",
                  opacity: username.trim() ? 1 : 0.7,
                }}
              >
                Continue
              </button>
            </>
          )}

          {currentStep === "createUser" && (
            <>
              <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-[#a763e6] mb-2 sm:mb-3 tracking-[1.1px]">
                Create Your Account
              </h2>
              <p className="text-[#c6baff] font-medium opacity-88 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">
                Hello <strong>{username}</strong>! Let's create your blockchain account.
              </p>
              <button
                onClick={createUser}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#d7a3ff] to-[#a763e6] text-[#1b0f28] border-none py-2 sm:py-3 text-sm sm:text-base md:text-lg font-bold rounded-xl cursor-pointer font-orbitron tracking-[1.1px] mb-1"
                style={{
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : `0 4px 16px ${accent2}23`,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </>
          )}

          {currentStep === "authenticate" && (
            <>
              <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-[#a763e6] mb-2 sm:mb-3 tracking-[1.1px]">
                Authenticate Wallet
              </h2>
              <p className="text-[#c6baff] font-medium opacity-88 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">
                Sign a message to verify your wallet ownership.
              </p>
              <button
                onClick={authenticateUser}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#d7a3ff] to-[#a763e6] text-[#1b0f28] border-none py-2 sm:py-3 text-sm sm:text-base md:text-lg font-bold rounded-xl cursor-pointer font-orbitron tracking-[1.1px] mb-1"
                style={{
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : `0 4px 16px ${accent2}23`,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Authenticating..." : "Sign Message"}
              </button>
            </>
          )}

          {currentStep === "createProfile" && (
            <>
              <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-[#a763e6] mb-2 sm:mb-3 tracking-[1.1px]">
                Create Game Profile
              </h2>
              <p className="text-[#c6baff] font-medium opacity-88 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">
                Final step! Create your gaming profile on the blockchain.
              </p>
              <button
                onClick={createProfile}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#d7a3ff] to-[#a763e6] text-[#1b0f28] border-none py-2 sm:py-3 text-sm sm:text-base md:text-lg font-bold rounded-xl cursor-pointer font-orbitron tracking-[1.1px] mb-1"
                style={{
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : `0 4px 16px ${accent2}23`,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Creating..." : "Create Profile"}
              </button>
            </>
          )}

          {currentStep === "complete" && (
            <>
              <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-[#10b981] mb-2 sm:mb-3 tracking-[1.1px]">
                🎉 Profile Ready!
              </h2>
              <p className="text-[#c6baff] font-medium opacity-88 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">
                Welcome to Dash Race, <strong>{username}</strong>! You're all set to play.
              </p>
              <div className="text-[#10b981] font-bold text-sm sm:text-base md:text-lg">
                ✅ Setup Complete
              </div>
            </>
          )}
        </div>

        {/* Status */}
        {status && (
          <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm md:text-base font-medium"
            style={{
              color: status.startsWith("✅") ? "#10b981" : status.startsWith("❌") ? "#ef4444" : accent2,
            }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
