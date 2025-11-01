"use client"

import { useState, useEffect } from "react"
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
  Star,
  Plus,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { useAccount } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { CONTRACT_EVM_ADDRESS, CONTRACT_ABI } from "../../lib/contract"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import toast from "react-hot-toast"
import { readUser, readUserListings, readUserProposals, readBarterProposal, readUserNFTs, readListing } from "../../lib/utils"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [registerForm, setRegisterForm] = useState({
    name: "",
    skillsOffered: "",
    skillsWanted: ""
  })
  
  const { address, isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { writeContractAsync, isPending } = useWriteContract()
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined)
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  // On-chain data
  const [userData, setUserData] = useState<any | null>(null)
  const [userListingIds, setUserListingIds] = useState<bigint[]>([])
  const [userProposalIds, setUserProposalIds] = useState<bigint[]>([])
  const [userNftIds, setUserNftIds] = useState<bigint[]>([])
  const [loadingProfile, setLoadingProfile] = useState(false)
  // Additional state - MUST be declared before any conditional returns
  const [trades, setTrades] = useState<any[]>([])
  const [userListings, setUserListings] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!address) return
      try {
        setLoadingProfile(true)
        console.log("🔄 Loading profile data for:", address)
        
        const [u, lIds, pIds, nIds] = await Promise.all([
          readUser(address as `0x${string}`),
          readUserListings(address as `0x${string}`),
          readUserProposals(address as `0x${string}`),
          readUserNFTs(address as `0x${string}`),
        ])
        
        console.log("📊 Profile data loaded:", { 
          user: u, 
          listings: lIds.length, 
          proposals: pIds.length, 
          nfts: nIds.length 
        })
        
        if (!mounted) return
        setUserData(u)
        setUserListingIds(lIds)
        setUserProposalIds(pIds)
        setUserNftIds(nIds)
      } catch (e) {
        console.error("❌ Failed loading profile:", e)
      } finally {
        if (mounted) setLoadingProfile(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [address])

  // Auto-open registration modal when connected but not registered
  useEffect(() => {
    if (isConnected && userData && userData.isRegistered === false) {
      setShowRegisterModal(true)
    }
  }, [isConnected, userData])

  // Load user proposals → trades
  useEffect(() => {
    async function loadTrades() {
      if (userProposalIds.length === 0) { setTrades([]); return }
      try {
        const tradeData = await Promise.all(
          userProposalIds.map(async (id) => {
            const proposal = await readBarterProposal(Number(id))
            if (!proposal) return null
            return {
              id: Number(id),
              type: "Active",
              skill: "Skill Exchange",
              partner: "Trading Partner",
              date: new Date().toLocaleDateString(),
              status: "in_progress"
            }
          })
        )
        setTrades(tradeData.filter(Boolean))
      } catch (e) {
        console.error("Error loading trades:", e)
      }
    }
    loadTrades()
  }, [userProposalIds])

  // Load user listings
  useEffect(() => {
    async function loadListings() {
      if (userListingIds.length === 0) { setUserListings([]); return }
      try {
        const listingData = await Promise.all(
          userListingIds.map(async (id) => {
            const listing = await readListing(Number(id))
            if (!listing) return null
            return {
              id: Number(id),
              skillOffered: listing.skillOffered,
              skillWanted: listing.skillWanted,
              description: listing.description,
              isActive: listing.isActive,
              createdAt: listing.createdAt
            }
          })
        )
        setUserListings(listingData.filter(Boolean))
      } catch (e) {
        console.error("Error loading listings:", e)
      }
    }
    loadListings()
  }, [userListingIds])

  // Computed values (after all hooks)
  // Real NFTs from contract
  const nfts = userNftIds.map((id, index) => ({
    id: Number(id),
    skill: `Skill Trade #${Number(id)}`,
    date: new Date().toLocaleDateString(),
    partner: "Trading Partner",
  }))

  // Real profile data from contract
  const profile = {
    name: (userData?.name && String(userData.name).trim().length > 0) ? userData.name : "SkillSwap User",
    address: address ? `${address.slice(0,6)}...${address.slice(-4)}` : "0x0000...0000",
    reputation: Number(userData?.reputation || 0),
    totalTrades: Number(userData?.totalTrades || 0),
    skillsOffered: (userData?.skillsOffered as string[] | undefined) || [],
    skillsWanted: (userData?.skillsWanted as string[] | undefined) || [],
    isRegistered: Boolean(userData?.isRegistered),
  }

  // Gate: require wallet connection to view profile (ALL HOOKS MUST BE ABOVE THIS)
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <User className="w-20 h-20 mx-auto text-gray-700 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Connect your wallet</h2>
          <p className="text-gray-400 mb-6">Connect to view your SkillSwap profile and activity.</p>
          <button
            onClick={openConnectModal || (() => {})}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }


  const handleRegister = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first")
      return
    }
    
    if (!registerForm.name || !registerForm.skillsOffered || !registerForm.skillsWanted) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      const skillsOfferedArray = registerForm.skillsOffered.split(',').map(s => s.trim()).filter(s => s)
      const skillsWantedArray = registerForm.skillsWanted.split(',').map(s => s.trim()).filter(s => s)
      
      const p = writeContractAsync({
        chainId: 296,
        address: CONTRACT_EVM_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "registerUser",
        args: [registerForm.name, skillsOfferedArray, skillsWantedArray],
      })
      
      const hash = (await toast.promise(p, {
        loading: "Registering user...",
        success: "Registration submitted. Awaiting confirmation...",
        error: "Registration failed",
      })) as `0x${string}`
      setTxHash(hash)
    } catch (err) {
      console.error("Error registering user:", err)
      toast.error("Failed to register user")
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setShowRegisterModal(false)
      setRegisterForm({ name: "", skillsOffered: "", skillsWanted: "" })
      toast.success("User registered successfully")
      // Refresh profile data
      if (address) {
        ;(async () => {
          const [u, lIds, pIds, nIds] = await Promise.all([
            readUser(address as `0x${string}`),
            readUserListings(address as `0x${string}`),
            readUserProposals(address as `0x${string}`),
            readUserNFTs(address as `0x${string}`),
          ])
          setUserData(u)
          setUserListingIds(lIds)
          setUserProposalIds(pIds)
          setUserNftIds(nIds)
        })()
      }
    }
  }, [isSuccess])

  // Proposal actions
  const acceptProposal = async (proposalId: number) => {
    try {
      const p = writeContractAsync({
        chainId: 296,
        address: CONTRACT_EVM_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "acceptBarterProposal",
        args: [BigInt(proposalId)],
      })
      await toast.promise(p, { loading: "Accepting...", success: "Accepted", error: "Failed" })
    } catch (e) { console.error(e) }
  }
  const completeProposal = async (proposalId: number) => {
    try {
      const p = writeContractAsync({
        chainId: 296,
        address: CONTRACT_EVM_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "markBarterCompleted",
        args: [BigInt(proposalId)],
      })
      await toast.promise(p, { loading: "Completing...", success: "Completion recorded", error: "Failed" })
    } catch (e) { console.error(e) }
  }
  const disputeProposal = async (proposalId: number, reason: string) => {
    try {
      const p = writeContractAsync({
        chainId: 296,
        address: CONTRACT_EVM_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "raiseDispute",
        args: [BigInt(proposalId), reason],
      })
      await toast.promise(p, { loading: "Raising dispute...", success: "Dispute raised", error: "Failed" })
    } catch (e) { console.error(e) }
  }

  // Show loading state
  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Show registration prompt if not registered
  if (!profile.isRegistered && isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <User className="w-20 h-20 mx-auto text-gray-700 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Complete Your Profile</h2>
          <p className="text-gray-400 mb-6">Register to start trading skills on SkillSwap</p>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Register Now
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
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
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
                  <p className="text-gray-400 mb-4">{profile.address}</p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-semibold">{profile.reputation}</span>
                      <span className="text-gray-400">Reputation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white font-semibold">{profile.totalTrades}</span>
                      <span className="text-gray-400">Trades</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                {!isConnected ? (
                  <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Connect Wallet
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowRegisterModal(true)}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Register
                  </button>
                )}
                <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Settings
                </button>
              </div>
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
                  <div className="flex flex-wrap gap-3 min-h-[2rem]">
                    {profile.skillsOffered.length === 0 && (
                      <span className="text-gray-500">None yet</span>
                    )}
                    {profile.skillsOffered.map((skill, index) => (
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
                  <div className="flex flex-wrap gap-3 min-h-[2rem]">
                    {profile.skillsWanted.length === 0 && (
                      <span className="text-gray-500">None yet</span>
                    )}
                    {profile.skillsWanted.map((skill, index) => (
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

          {/* My Listings Section */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 mb-6"
            >
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-400" />
                My Skill Listings ({userListingIds.length})
              </h3>
              <div className="space-y-4">
                {userListings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No listings yet. <Link href="/skills" className="text-blue-400 hover:underline">Create your first listing</Link></p>
                ) : (
                  userListings.map((listing) => (
                    <div key={listing.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-white">{listing.skillOffered}</h4>
                          <p className="text-gray-400 text-sm">Wants: {listing.skillWanted}</p>
                          <p className="text-gray-300 text-sm mt-2">{listing.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${listing.isActive ? 'bg-green-900 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                          {listing.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "nft" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">My Skill NFTs</h3>
                <Link 
                  href="/marketplace"
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg text-white text-sm font-medium hover:from-yellow-600 hover:to-orange-700 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Marketplace
                </Link>
              </div>
              {nfts.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="w-20 h-20 text-gray-700 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-400 mb-2">No NFTs yet</h4>
                  <p className="text-gray-500 mb-6">Complete a skill exchange to earn your first NFT!</p>
                  <Link 
                    href="/skills"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-colors"
                  >
                    Browse Skills
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {nfts.map((nft) => (
                    <div key={nft.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors group cursor-pointer relative overflow-hidden">
                      <div className="absolute top-4 right-4 z-10">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          #{nft.id}
                        </div>
                      </div>
                      <div className="w-full h-32 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-xl mb-4 flex items-center justify-center text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                        <Award className="w-16 h-16 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h4 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">{nft.skill}</h4>
                      <p className="text-sm text-gray-400">Exchange with: {nft.partner}</p>
                      <p className="text-xs text-gray-500 mt-2">{nft.date}</p>
                      <button
                        onClick={() => window.location.href = `/marketplace`}
                        className="mt-4 w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors opacity-0 group-hover:opacity-100"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                {userProposalIds.length === 0 && (
                  <div className="text-gray-500">No proposals yet</div>
                )}
                {userProposalIds.map((pid) => (
                  <div key={String(pid)} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-600 text-white">
                          #{String(pid)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">Proposal {String(pid)}</h4>
                          <p className="text-sm text-gray-400">Use actions to accept/complete/dispute</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => acceptProposal(Number(pid))} className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm">Accept</button>
                        <button onClick={() => completeProposal(Number(pid))} className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">Mark Complete</button>
                        <button onClick={() => disputeProposal(Number(pid), "Unfair terms") } className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm">Dispute</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Register User</h2>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  placeholder="e.g., John Doe"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Skills You Offer (comma-separated)
                </label>
                <input
                  type="text"
                  value={registerForm.skillsOffered}
                  onChange={(e) => setRegisterForm({ ...registerForm, skillsOffered: e.target.value })}
                  placeholder="e.g., Web Development, JavaScript, React"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Skills You Want (comma-separated)
                </label>
                <input
                  type="text"
                  value={registerForm.skillsWanted}
                  onChange={(e) => setRegisterForm({ ...registerForm, skillsWanted: e.target.value })}
                  placeholder="e.g., Graphic Design, UI/UX, Marketing"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegister}
                  disabled={isPending || isConfirming}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
                >
                  {isPending ? "Confirming..." : isConfirming ? "Registering..." : "Register"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}