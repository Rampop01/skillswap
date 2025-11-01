"use client"

import { useState } from "react"
import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800/80 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/30">
      <nav className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="text-4xl sm:text-5xl font-black bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-none drop-shadow-lg">
            S
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base sm:text-lg font-light italic text-white tracking-wide group-hover:text-blue-400 transition-colors">
              skill
            </span>
            <span className="text-xs font-bold text-gray-500 tracking-widest group-hover:text-purple-400 transition-colors">
              swap
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
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

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ConnectButton />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-black/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Link 
              href="/skills" 
              className="text-gray-300 hover:text-white transition-colors py-2 px-2 rounded-lg hover:bg-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Skills
            </Link>
            <Link 
              href="/marketplace" 
              className="text-gray-300 hover:text-white transition-colors py-2 px-2 rounded-lg hover:bg-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link 
              href="/profile" 
              className="text-gray-300 hover:text-white transition-colors py-2 px-2 rounded-lg hover:bg-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}



