"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Search, 
  Plus, 
  Code, 
  Palette, 
  Briefcase, 
  Music,
  Camera,
  Book,
  Wrench,
  GraduationCap,
  Heart,
  TrendingUp,
  Award
} from "lucide-react"
import Link from "next/link"

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")

  const mockListings = [
    {
      id: 1,
      skillsOffered: "Web Development",
      skillsWanted: "Graphic Design",
      creator: "0x1234...5678",
      description: "Looking for a designer to create my brand identity. I can help build your website or web app in return.",
      reputation: 150,
      timestamp: "2 days ago"
    },
    {
      id: 2,
      skillsOffered: "Graphic Design",
      skillsWanted: "Web Development",
      creator: "0xabcd...efgh",
      description: "Professional logo and brand design services. Need help with my portfolio website.",
      reputation: 200,
      timestamp: "1 day ago"
    },
    {
      id: 3,
      skillsOffered: "Music Production",
      skillsWanted: "Video Editing",
      creator: "0x9876...5432",
      description: "Can produce original beats and music. Looking for video editing help for my YouTube channel.",
      reputation: 120,
      timestamp: "3 days ago"
    },
    {
      id: 4,
      skillsOffered: "Photography",
      skillsWanted: "Social Media Marketing",
      creator: "0x4567...8901",
      description: "Professional event and portrait photography. Need social media strategy expertise.",
      reputation: 180,
      timestamp: "4 days ago"
    },
  ]

  const categories = [
    { id: "all", label: "All", icon: <TrendingUp className="w-5 h-5" /> },
    { id: "tech", label: "Tech", icon: <Code className="w-5 h-5" /> },
    { id: "design", label: "Design", icon: <Palette className="w-5 h-5" /> },
    { id: "business", label: "Business", icon: <Briefcase className="w-5 h-5" /> },
    { id: "creative", label: "Creative", icon: <Heart className="w-5 h-5" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="w-5 h-5" /> },
  ]

  const getSkillIcon = (skill: string) => {
    if (skill.includes("Web") || skill.includes("Code")) return <Code className="w-5 h-5" />
    if (skill.includes("Design")) return <Palette className="w-5 h-5" />
    if (skill.includes("Music")) return <Music className="w-5 h-5" />
    if (skill.includes("Photo")) return <Camera className="w-5 h-5" />
    if (skill.includes("Business")) return <Briefcase className="w-5 h-5" />
    return <Book className="w-5 h-5" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            SkillSwap
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/" className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
            Home
          </Link>
          <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors text-white font-medium">
            Create Listing
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Browse Skill Listings
          </h1>
          <p className="text-gray-400 text-lg">
            Discover skills to trade and find your perfect match
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  filter === category.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-gray-900/50 border border-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {category.icon}
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Skill Listings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-blue-500 transition-all cursor-pointer group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                    {getSkillIcon(listing.skillsOffered)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{listing.skillsOffered}</div>
                    <div className="text-xs text-gray-400">{listing.creator}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-medium">{listing.reputation}</span>
                </div>
              </div>

              {/* Wants */}
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-2">Wants:</div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                    {getSkillIcon(listing.skillsWanted)}
                  </div>
                  <span className="text-sm text-gray-300">{listing.skillsWanted}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{listing.description}</p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <span className="text-xs text-gray-500">{listing.timestamp}</span>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-colors">
                  Propose Trade
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {mockListings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2 text-gray-400">No skills found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-colors">
              Create First Listing
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

