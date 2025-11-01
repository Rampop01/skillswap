"use client"

import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800/80 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/30">
      <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="text-5xl font-black bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-none drop-shadow-lg">
            S
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-light italic text-white tracking-wide group-hover:text-blue-400 transition-colors">
              skill
            </span>
            <span className="text-xs font-bold text-gray-500 tracking-widest group-hover:text-purple-400 transition-colors">
              swap
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/skills" className="text-gray-300 hover:text-white transition-colors">
            Skills
          </Link>
          <Link href="/marketplace" className="text-gray-300 hover:text-white transition-colors">
            Marketplace
          </Link>
          <Link href="/profile" className="text-gray-300 hover:text-white transition-colors">
            Profile
          </Link>
          <ConnectButton />
        </div>
      </nav>
    </header>
  )
}



