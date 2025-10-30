"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800/80 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/30">
      <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            SkillSwap
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/skills" className="text-gray-300 hover:text-white transition-colors">
            Skills
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



