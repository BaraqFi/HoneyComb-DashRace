import "./globals.css"
import { ReactNode } from "react"
/* import NavBar from "@/components/NavBar" */
import WalletConnectionProvider from "@/components/walletProvider"
/* import { UserProvider } from "@/components/UserContext" */

export const metadata = {
  title: "Dash Race - Honeycomb Game",
  description: "Web3 Game + Honeycomb Protocol Integration",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ...fonts as before... */}
      </head>
      <body className="bg-black text-white min-h-screen font-sans">
        <WalletConnectionProvider>
          {/* <UserProvider> */}
            {/* <NavBar /> */}
            <main className="flex flex-col items-center">{children}</main>
          {/* </UserProvider> */}
        </WalletConnectionProvider>
      </body>
    </html>
  )
}
