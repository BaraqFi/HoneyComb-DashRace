import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { client } from "@/utils/client"
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers"

const PROJECT_ADDRESS = process.env.NEXT_PUBLIC_HONEYCOMB_PROJECT_ADDRESS!

export default function UpdateStatsButton({ score, miles }: { score: number, miles: number }) {
  const wallet = useWallet()
  const { publicKey, signMessage } = wallet
  const [userId, setUserId] = useState<number | null>(null)
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [accessToken, setAccessToken] = useState("")

  // Step 1: Get userId when publicKey changes
  useEffect(() => {
    if (!publicKey) return
    client.findUsers({ wallets: [publicKey.toString()] })
      .then(({ user }) => {
        if (user && user.length > 0) setUserId(user[0].id)
        else setUserId(null)
      })
      .catch(() => setUserId(null))
  }, [publicKey])

  // Optional: helper for JWT
  async function authenticateIfNeeded() {
    if (accessToken) return accessToken
    if (!publicKey || !signMessage) throw new Error("Wallet/signMessage not ready!")
    setStatus("Authenticating wallet...")
    const { authRequest: { message } } = await client.authRequest({ wallet: publicKey.toString() })
    const signed = await signMessage(new TextEncoder().encode(message))
    const bs58 = (await import("bs58")).default
    const signature = bs58.encode(signed)
    const { authConfirm } = await client.authConfirm({ wallet: publicKey.toString(), signature })
    setAccessToken(authConfirm.accessToken)
    return authConfirm.accessToken
  }

  // Step 2: Update stats cumulatively
  async function handleUpdate() {
    setLoading(true)
    setStatus("Preparing to update stats...")
    setSuccess(false)
    try {
      if (!publicKey || !userId) {
        setStatus("❌ Connect your wallet and ensure profile is set up.")
        setLoading(false)
        return
      }
      const token = await authenticateIfNeeded()

      // Profile lookup by userId
      const { profile } = await client.findProfiles({
        userIds: [userId],
        projects: [PROJECT_ADDRESS],
        identities: ["main"],
      })
      if (!profile || profile.length === 0) {
        setStatus("❌ Profile not found.")
        setLoading(false)
        return
      }
      const profileAddr = profile[0].address

      setStatus("Sending update transaction...")
      const { createUpdateProfileTransaction: txResponse } = await client.createUpdateProfileTransaction(
        {
          payer: publicKey.toString(),
          profile: profileAddr,
          customData: {
            add: {
              score: [String(score)],
              miles: [String(miles)],
            },
          },
        },
        {
          fetchOptions: {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        }
      )
      // ----------- FIX IS HERE: pass wallet, not fake object -----------
      await sendClientTransactions(client, wallet, txResponse)
      setStatus("✅ Stats updated!")
      setSuccess(true)
    } catch (e: any) {
      setStatus("❌ Error updating stats.")
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center">
      <button
        className={`px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl mt-2 disabled:opacity-50 ${success ? "bg-green-600 hover:bg-green-700" : ""}`}
        onClick={handleUpdate}
        disabled={loading || success}
      >
        {loading ? "Updating..." : success ? "Updated!" : "Update My Stats"}
      </button>
      {status && (
        <div className={`mt-2 text-sm font-medium ${success ? "text-green-700" : "text-gray-900"}`}>
          {status}
        </div>
      )}
    </div>
  )
}
