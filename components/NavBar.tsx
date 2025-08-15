// /components/NavBar.tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import WalletConnect from "./WalletConnect"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/game", label: "Game" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/tasks", label: "Tasks" },
  // { href: "/profile", label: "Profile" }, // optional
]

export default function NavBar() {
  const pathname = usePathname()
  return (
    <nav className="w-full flex justify-between items-center px-4 py-3 border-b border-white/10">
      <div className="flex gap-6">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-mono text-lg transition-all ${pathname === link.href ? "text-blue-400 underline" : "text-white hover:text-blue-300"}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div>
        <WalletConnect />
      </div>
    </nav>
  )
}
