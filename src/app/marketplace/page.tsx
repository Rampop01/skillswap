"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Store, 
  Search, 
  Filter,
  TrendingUp,
  Crown,
  Award,
  ShoppingCart,
  DollarSign,
  Eye,
  Heart,
  Calendar,
  User,
  Sparkles,
  RefreshCw,
  Clock
} from "lucide-react"
import { useAccount } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import toast from "react-hot-toast"
import { readUserNFTs, readListing, readBarterProposal, readTotalProposals, readNFTMetadata } from "../../lib/utils"
import { publicClient } from "../../lib/utils"
import { CONTRACT_EVM_ADDRESS, CONTRACT_ABI } from "../../lib/contract"

interface NFTMetadata {
  id: number
  skillOffered: string
  skillWanted: string
  partner: string
  timestamp: string
  completedAt: string
  isListed?: boolean
  price?: string
}

export default function MarketplacePage() {
  const { address, isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [nfts, setNfts] = useState<NFTMetadata[]>([])
  const [selectedNft, setSelectedNft] = useState<NFTMetadata | null>(null)
  const [showListingModal, setShowListingModal] = useState(false)
  const [listingPrice, setListingPrice] = useState("")
  const [nftId, setNftId] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    async function loadNFTs() {
      try {
        setLoading(true)
        console.log("🔄 Loading all NFTs for marketplace...")
        
        // Get all users who have NFTs by checking total proposals
        const totalProposals = await readTotalProposals()
        console.log("📊 Total proposals found:", totalProposals)
        
        // For now, we'll fetch NFTs from the connected user
        // In production, you'd fetch all NFTs from all users
        if (!isConnected || !address) {
          console.log("⚠️ Not connected, showing sample NFTs")
          // Show sample marketplace data for demo
          if (mounted) {
            setNfts([
              {
                id: 1,
                skillOffered: "Web Development",
                skillWanted: "Graphic Design",
                partner: "0xABC4...5678",
                timestamp: new Date(Date.now() - 86400000 * 5).toLocaleDateString(),
                completedAt: new Date(Date.now() - 86400000 * 3).toLocaleDateString(),
                isListed: true,
                price: "50 HBAR"
              },
              {
                id: 2,
                skillOffered: "JavaScript Tutoring",
                skillWanted: "UI/UX Design",
                partner: "0xDEF7...9ABC",
                timestamp: new Date(Date.now() - 86400000 * 10).toLocaleDateString(),
                completedAt: new Date(Date.now() - 86400000 * 8).toLocaleDateString(),
                isListed: true,
                price: "75 HBAR"
              },
              {
                id: 3,
                skillOffered: "React Development",
                skillWanted: "Logo Design",
                partner: "0x1234...CDEF",
                timestamp: new Date(Date.now() - 86400000 * 15).toLocaleDateString(),
                completedAt: new Date(Date.now() - 86400000 * 12).toLocaleDateString(),
                isListed: false
              }
            ])
            setLoading(false)
          }
          return
        }

        // Fetch user's NFTs
        const userNftIds = await readUserNFTs(address as `0x${string}`)
        console.log("✅ Found user NFTs:", userNftIds.length)
        
        const nftData: NFTMetadata[] = []
        
        // TODO: Fetch NFT metadata from contract
        // For now, we'll use the NFT IDs to get basic info
        for (const nftId of userNftIds) {
          try {
            // Try to get owner to verify NFT exists
            const owner = await publicClient.readContract({
              address: CONTRACT_EVM_ADDRESS,
              abi: CONTRACT_ABI,
              functionName: "ownerOf",
              args: [nftId],
            })

            if (owner && (owner as string).toLowerCase() === address?.toLowerCase()) {
              nftData.push({
                id: Number(nftId),
                skillOffered: "Skill Exchange",
                skillWanted: "Skill Exchange",
                partner: "Trading Partner",
                timestamp: new Date().toLocaleDateString(),
                completedAt: new Date().toLocaleDateString(),
                isListed: false
              })
            }
          } catch (e) {
            console.error(`Error fetching NFT ${Number(nftId)}:`, e)
          }
        }
        
        if (mounted) {
          setNfts(nftData)
          setLoading(false)
        }
      } catch (e: any) {
        console.error("❌ Error loading NFTs:", e)
        if (mounted) {
          setLoading(false)
          toast.error("Failed to load marketplace NFTs")
        }
      }
    }
    loadNFTs()
    return () => { mounted = false }
  }, [isConnected, address])

  const handleListNFT = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!listingPrice || isNaN(parseFloat(listingPrice))) {
      toast.error("Please enter a valid price")
      return
    }

    if (!nftId) {
      toast.error("Invalid NFT ID")
      return
    }

    try {
      // TODO: Implement contract call to list NFT for sale
      // await writeContractAsync({
      //   chainId: 296,
      //   address: CONTRACT_EVM_ADDRESS,
      //   abi: CONTRACT_ABI,
      //   functionName: "listNFTForSale",
      //   args: [BigInt(nftId), listingPrice],
      // })

      // For now, just update the UI
      setNfts(nfts.map(nft => 
        nft.id === nftId 
          ? { ...nft, isListed: true, price: `${listingPrice} HBAR` }
          : nft
      ))
      
      setShowListingModal(false)
      setListingPrice("")
      setNftId(null)
      toast.success("NFT listed for sale!")
    } catch (err) {
      console.error("Error listing NFT:", err)
      toast.error("Failed to list NFT")
    }
  }

  const handleBuyNFT = async (nft: NFTMetadata) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      openConnectModal?.()
      return
    }

    if (!nft.isListed || !nft.price) {
      toast.error("This NFT is not listed for sale")
      return
    }

    try {
      // TODO: Implement contract call to buy NFT
      // await writeContractAsync({
      //   chainId: 296,
      //   address: CONTRACT_EVM_ADDRESS,
      //   abi: CONTRACT_ABI,
      //   functionName: "buyNFT",
      //   args: [BigInt(nft.id)],
      //   value: parseEther(nft.price.split(" ")[0])
      // })

      toast.success("NFT purchase initiated!")
    } catch (err) {
      console.error("Error buying NFT:", err)
      toast.error("Failed to purchase NFT")
    }
  }

  const categories = [
    { id: "all", label: "All NFTs", icon: <Store className="w-5 h-5" /> },
    { id: "listed", label: "Listed", icon: <DollarSign className="w-5 h-5" /> },
    { id: "my", label: "My NFTs", icon: <Award className="w-5 h-5" /> },
  ]

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = searchQuery === "" || 
      nft.skillOffered.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.skillWanted.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filter === "all" ||
      (filter === "listed" && nft.isListed) ||
      (filter === "my" && nft.isListed === false)
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4 relative">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
              <Store className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              NFT Marketplace
            </h1>
            <div className="absolute -top-2 -right-2 sm:top-0 sm:right-0">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Coming Soon</span>
                <span className="sm:hidden">Soon</span>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Trade your skill exchange NFTs and discover unique achievements from the SkillSwap community
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          {[
            { value: nfts.length.toString(), label: "Total NFTs", icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" /> },
            { value: nfts.filter(n => n.isListed).length.toString(), label: "Listed", icon: <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" /> },
            { value: nfts.filter(n => !n.isListed).length.toString(), label: "Not Listed", icon: <Store className="w-5 h-5 sm:w-6 sm:h-6" /> },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center"
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="text-blue-400">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search NFTs by skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                  filter === category.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-gray-900/50 border border-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                <span className="w-4 h-4 sm:w-5 sm:h-5">{category.icon}</span>
                {category.label}
              </button>
            ))}
            <button
              onClick={async () => {
                setLoading(true)
                const userNftIds = await readUserNFTs(address as `0x${string}`)
                toast.success("Refreshed")
                setLoading(false)
              }}
              className="px-3 sm:px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-400 py-12 sm:py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <div className="text-sm sm:text-base">Loading marketplace...</div>
          </div>
        )}

        {/* NFT Grid */}
        {!loading && filteredNFTs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredNFTs.map((nft, index) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-blue-500 transition-all cursor-pointer group relative overflow-hidden"
              >
                {/* Premium Badge */}
                {nft.isListed && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      LISTED
                    </div>
                  </div>
                )}

                {/* NFT Image/Icon */}
                <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-xl mb-3 sm:mb-4 flex items-center justify-center text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <Award className="w-20 h-20 sm:w-24 sm:h-24 opacity-50" />
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                      <div className="text-xl sm:text-2xl font-bold">#{nft.id}</div>
                    </div>
                  </div>
                </div>

                {/* NFT Details */}
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Skill Offered
                    </div>
                    <h3 className="font-semibold text-white text-base sm:text-lg">{nft.skillOffered}</h3>
                  </div>

                  <div>
                    <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      Skill Wanted
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base">{nft.skillWanted}</p>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {nft.partner}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {nft.completedAt}
                    </div>
                  </div>

                  {nft.isListed && nft.price && (
                    <div className="pt-2 sm:pt-3 border-t border-gray-800">
                      <div className="text-xs text-gray-400 mb-1">Price</div>
                      <div className="text-xl sm:text-2xl font-bold text-blue-400">{nft.price}</div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 sm:pt-4">
                    <button
                      onClick={() => setSelectedNft(nft)}
                      className="flex-1 px-3 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 sm:gap-2"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      View
                    </button>
                    {nft.isListed ? (
                      <button
                        onClick={() => handleBuyNFT(nft)}
                        className="flex-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 sm:gap-2"
                      >
                        <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                        Buy
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setNftId(nft.id)
                          setShowListingModal(true)
                        }}
                        className="flex-1 px-3 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 sm:gap-2"
                      >
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                        List
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredNFTs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Store className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2 text-gray-400">No NFTs found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? "Try adjusting your search" : "Complete a skill exchange to mint your first NFT!"}
            </p>
          </motion.div>
        )}
      </div>

      {/* NFT Detail Modal */}
      {selectedNft && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">NFT Details</h2>
              <button
                onClick={() => setSelectedNft(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Sparkles className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="w-full h-64 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white relative overflow-hidden mb-6">
                <div className="absolute inset-0 bg-black/20"></div>
                <Award className="w-32 h-32 opacity-50" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-3xl font-bold">#{selectedNft.id}</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Skill Offered</label>
                <p className="text-white text-lg font-semibold">{selectedNft.skillOffered}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400">Skill Wanted</label>
                <p className="text-white text-lg">{selectedNft.skillWanted}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400">Trading Partner</label>
                <p className="text-white">{selectedNft.partner}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400">Completed</label>
                <p className="text-white">{selectedNft.completedAt}</p>
              </div>

              {selectedNft.isListed && selectedNft.price && (
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4">
                  <label className="text-sm text-gray-400">Listed Price</label>
                  <p className="text-blue-400 text-2xl font-bold">{selectedNft.price}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedNft(null)}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
                >
                  Close
                </button>
                {selectedNft.isListed && (
                  <button
                    onClick={() => handleBuyNFT(selectedNft)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-medium transition-colors"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* List NFT Modal */}
      {showListingModal && nftId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">List NFT for Sale</h2>
              <button
                onClick={() => {
                  setShowListingModal(false)
                  setNftId(null)
                  setListingPrice("")
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Sparkles className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center py-4 bg-gray-800 rounded-lg mb-4">
                <div className="text-4xl font-bold text-blue-400 mb-2">#{nftId}</div>
                <div className="text-sm text-gray-400">NFT ID</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (HBAR)
                </label>
                <input
                  type="number"
                  value={listingPrice}
                  onChange={(e) => setListingPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                <div className="text-sm text-blue-300">
                  <strong>Note:</strong> Listing your NFT will make it available for purchase by other users.
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowListingModal(false)
                    setNftId(null)
                    setListingPrice("")
                  }}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleListNFT}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-medium transition-colors"
                >
                  List for Sale
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

