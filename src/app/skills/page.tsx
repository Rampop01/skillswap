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
  Award,
  X,
  RefreshCcw
} from "lucide-react"
import Link from "next/link"
import { readTotalListings, readListing } from "../../lib/utils"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { CONTRACT_EVM_ADDRESS, CONTRACT_ABI } from "../../lib/contract"
import { readUser } from "../../lib/utils"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import toast from "react-hot-toast"

export default function SkillsPage() {
  const { openConnectModal } = useConnectModal()
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [listings, setListings] = useState<Array<{
    id: number
    skillsOffered: string
    skillsWanted: string
    creator: string
    description: string
    reputation: number
    timestamp: string
  }>>([])
  const [proposeForListingId, setProposeForListingId] = useState<number | null>(null)
  const [proposalText, setProposalText] = useState("")
  
  // Create listing modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    skillOffered: "",
    skillWanted: "",
    description: ""
  })
  
  const { address, isConnected } = useAccount()
  const { writeContractAsync, error: writeError, isPending } = useWriteContract()
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined)
  const [refreshKey, setRefreshKey] = useState(0)
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        console.log("🔄 Loading listings...")
        const total = await readTotalListings()
        console.log("📊 Total listings to fetch:", total)
        const items: typeof listings = []
        for (let i = 1; i <= total; i++) {
          const l = await readListing(i)
          if (!l || !l.isActive) {
            console.log(`⏭️ Skipping listing ${i} (inactive or error)`)
            continue
          }
          items.push({
            id: Number(l.id),
            skillsOffered: l.skillOffered,
            skillsWanted: l.skillWanted,
            creator: `${l.creator.slice(0,6)}...${l.creator.slice(-4)}`,
            description: l.description,
            reputation: 0,
            timestamp: new Date(Number(l.createdAt) * 1000).toLocaleDateString(),
          })
        }
        console.log(`✅ Loaded ${items.length} active listings`)
        if (mounted) setListings(items)
      } catch (e: any) {
        console.error("❌ Error loading listings:", e)
        if (mounted) setError(e.message || "Failed to load listings")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [refreshKey])

  // Handle successful transaction
  useEffect(() => {
    if (isSuccess && txHash) {
      setShowCreateModal(false)
      setCreateForm({ skillOffered: "", skillWanted: "", description: "" })
      toast.success("Listing created successfully")
      const url = `https://hashscan.io/testnet/transaction/${txHash}`
      toast((t) => (
        <span>
          Confirmed. <a href={url} target="_blank" rel="noreferrer" className="underline text-blue-400">View on HashScan</a>
        </span>
      ))
      setRefreshKey(prev => prev + 1)
      setTxHash(undefined)
    }
  }, [isSuccess, txHash])

  const handleCreateListing = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first")
      return
    }
    
    if (!createForm.skillOffered || !createForm.skillWanted || !createForm.description) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      // Optimistic auto-register. If already registered, continue silently.
      if (address) {
        try {
          const reg = writeContractAsync({
            chainId: 296,
            address: CONTRACT_EVM_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "registerUser",
            args: ["SkillSwap User", [createForm.skillOffered || ""].filter(Boolean), [createForm.skillWanted || ""].filter(Boolean)],
          })
          await toast.promise(reg, { loading: "Registering user...", success: "Registered", error: "Already registered? Proceeding..." })
        } catch (e) {
          // ignore and proceed to create listing
        }
      }

      const p = writeContractAsync({
        chainId: 296,
        address: CONTRACT_EVM_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "createSkillListing",
        args: [createForm.skillOffered, createForm.skillWanted, createForm.description],
      })
      const hash = (await toast.promise(p, {
        loading: "Submitting transaction...",
        success: "Submitted. Awaiting confirmation...",
        error: "Transaction failed",
      })) as `0x${string}`
      setTxHash(hash)
      toast("View on HashScan", {
        icon: "🔗",
      })
    } catch (err) {
      console.error("Error creating listing:", err)
      toast.error("Failed to create listing")
    }
  }

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
      {/* Navigation moved to shared Navbar */}

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
          <p className="text-gray-400 text-lg mb-6">
            Discover skills to trade and find your perfect match
          </p>
          {isConnected && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create New Listing
            </button>
          )}
        </motion.div>

        {/* Controls */}
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

          {/* Category Filters + Refresh */}
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
            <button
              onClick={() => {
                ;(async () => {
                  setLoading(true)
                  setError(null)
                  const total = await readTotalListings()
                  const items: typeof listings = []
                  for (let i = 1; i <= total; i++) {
                    const l = await readListing(i)
                    if (!l || !l.isActive) continue
                    items.push({
                      id: Number(l.id),
                      skillsOffered: l.skillOffered,
                      skillsWanted: l.skillWanted,
                      creator: `${l.creator.slice(0,6)}...${l.creator.slice(-4)}`,
                      description: l.description,
                      reputation: 0,
                      timestamp: "",
                    })
                  }
                  setListings(items)
                  setLoading(false)
                  toast.success("Refreshed")
                })()
              }}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white"
            >
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Loading / Error */}
        {loading && (
          <div className="text-center text-gray-400 py-16">Loading listings...</div>
        )}
        {error && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold mb-2 text-gray-300">No listings yet</h3>
            <p className="text-gray-500 mb-6">Connect your wallet and create the first listing.</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-colors"
            >
              Create Listing
            </button>
          </div>
        )}

        {/* Skill Listings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing, index) => (
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
                <span className="text-xs text-gray-500">{listing.timestamp || ""}</span>
                <button 
                  onClick={() => setProposeForListingId(listing.id)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-colors"
                >
                  Propose Trade
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && !error && listings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2 text-gray-400">No skills found</h3>
            <p className="text-gray-500 mb-6">Be the first to create a skill listing!</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-colors"
            >
              Create First Listing
            </button>
          </motion.div>
        )}
      </div>

      {/* Create Listing Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create Skill Listing</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Skill You Offer
                </label>
                <input
                  type="text"
                  value={createForm.skillOffered}
                  onChange={(e) => setCreateForm({ ...createForm, skillOffered: e.target.value })}
                  placeholder="e.g., Web Development"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Skill You Want
                </label>
                <input
                  type="text"
                  value={createForm.skillWanted}
                  onChange={(e) => setCreateForm({ ...createForm, skillWanted: e.target.value })}
                  placeholder="e.g., Graphic Design"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Describe what you can offer and what you're looking for..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateListing}
                  disabled={isPending || isConfirming}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
                >
                  {isPending ? "Confirming..." : isConfirming ? "Creating..." : "Create Listing"}
                </button>
              </div>

              {writeError && (
                <div className="text-red-400 text-sm mt-2">
                  Error: {writeError.message}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Propose Trade Modal */}
      {proposeForListingId !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Propose Trade</h2>
              <button
                onClick={() => setProposeForListingId(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-gray-400 text-sm">Listing ID: {proposeForListingId}</div>
              <textarea
                value={proposalText}
                onChange={(e) => setProposalText(e.target.value)}
                placeholder="Describe your exchange proposal..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setProposeForListingId(null)}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!isConnected) { toast.error("Connect wallet first"); return }
                    if (!proposalText.trim()) { toast.error("Proposal cannot be empty"); return }
                    try {
                      const p = writeContractAsync({
                        chainId: 296,
                        address: CONTRACT_EVM_ADDRESS,
                        abi: CONTRACT_ABI,
                        functionName: "createBarterProposal",
                        args: [BigInt(proposeForListingId), proposalText.trim()],
                      })
                      await toast.promise(p, {
                        loading: "Submitting proposal...",
                        success: "Proposal submitted",
                        error: "Failed to submit proposal",
                      })
                      setProposeForListingId(null)
                      setProposalText("")
                    } catch (e) {
                      console.error(e)
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-medium transition-colors"
                >
                  Send Proposal
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

