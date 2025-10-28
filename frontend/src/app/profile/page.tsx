"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  User, 
  Award, 
  TrendingUp, 
  Briefcase, 
  FileText,
  Settings,
  Shield,
  Heart,
  CheckCircle,
  Clock,
  Star
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")

  const mockProfile = {
    name: "Alex Developer",
    address: "0x1234...5678",
    reputation: 250,
    totalTrades: 15,
    skillsOffered: ["Web Development", "JavaScript", "React", "Node.js"],
    skillsWanted: ["Graphic Design", "UI/UX", "Marketing"],
  }

  const mockNFTs = [
    { id: 1, skill: "Web Development", date: "2024-01-15", partner: "0xabcd..." },
    { id: 2, skill: "Logo Design", date: "2024-02-20", partner: "0xefgh..." },
    { id: 3, skill: "Copywriting", date: "2024-03-10", partner: "0xijkl..." },
  ]

  const mockTrades = [
    { id: 1, type: "Completed", skill: "React Development", partner: "Sarah", date: "2 days ago", status: "success" },
    { id: 2, type: "Active", skill: "Logo Design", partner: "Mike", date: "1 week ago", status: "in_progress" },
    { id: 3, type: "Completed", skill: "Website Build", partner: "Emma", date: "2 weeks ago", status: "success" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            SkillSwap
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/" className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/skills" className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
            Browse
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 mb-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                  {mockProfile.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{mockProfile.name}</h1>
                  <p className="text-gray-400 mb-4">{mockProfile.address}</p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-semibold">{mockProfile.reputation}</span>
                      <span className="text-gray-400">Reputation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white font-semibold">{mockProfile.totalTrades}</span>
                      <span className="text-gray-400">Trades</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings
              </button>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            {[
              { id: "profile", label: "Skills", icon: <User className="w-5 h-5" /> },
              { id: "nft", label: "NFTs", icon: <Award className="w-5 h-5" /> },
              { id: "trades", label: "Trades", icon: <Briefcase className="w-5 h-5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-gray-900/50 border border-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
            >
              <div className="space-y-6">
                {/* Skills Offered */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Skills I Offer
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {mockProfile.skillsOffered.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills Wanted */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    Skills I Want to Learn
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {mockProfile.skillsWanted.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "nft" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
            >
              <h3 className="text-xl font-semibold text-white mb-6">My Skill NFTs</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {mockNFTs.map((nft) => (
                  <div key={nft.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors">
                    <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 flex items-center justify-center text-white text-4xl font-bold">
                      <Award className="w-16 h-16" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">{nft.skill}</h4>
                    <p className="text-sm text-gray-400">Exchange with: {nft.partner}</p>
                    <p className="text-xs text-gray-500 mt-2">{nft.date}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "trades" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Trade History</h3>
              <div className="space-y-4">
                {mockTrades.map((trade) => (
                  <div key={trade.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          trade.status === "success" ? "bg-green-500" : "bg-yellow-500"
                        }`}>
                          {trade.status === "success" ? (
                            <CheckCircle className="w-6 h-6 text-white" />
                          ) : (
                            <Clock className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{trade.skill}</h4>
                          <p className="text-sm text-gray-400">with {trade.partner}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          trade.type === "Completed" 
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {trade.type}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{trade.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

