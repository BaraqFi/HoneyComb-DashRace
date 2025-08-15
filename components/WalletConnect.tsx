"use client"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export default function WalletConnect() {
  return (
    <div className="flex items-center justify-center">
      <WalletMultiButton />
    </div>
  )
}
