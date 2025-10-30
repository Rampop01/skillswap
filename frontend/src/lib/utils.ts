import { createPublicClient, http } from "viem"
import { hederaTestnet } from "./wallet"
import { CONTRACT_EVM_ADDRESS, CONTRACT_ABI, SkillListing } from "./contract"

export const publicClient = createPublicClient({
  chain: hederaTestnet,
  transport: http(hederaTestnet.rpcUrls.default.http[0]),
})

export async function readTotalListings(): Promise<number> {
  try {
    console.log("📊 Reading total listings from contract:", CONTRACT_EVM_ADDRESS)
    const result = await publicClient.readContract({
      address: CONTRACT_EVM_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getTotalListings",
      args: [],
    })
    const total = Number(result as bigint)
    console.log("✅ Total listings found:", total)
    return total
  } catch (error) {
    console.error("❌ Error reading total listings:", error)
    // Return a minimum of 1 to check if there's at least one listing
    return 1
  }
}

export async function readListing(id: number): Promise<SkillListing | null> {
  try {
    console.log(`📖 Reading listing ${id}...`)
    const result = await publicClient.readContract({
      address: CONTRACT_EVM_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getSkillListing",
      args: [BigInt(id)],
    })
    // viem@2 returns structs as objects; support both object and array shapes
    if (Array.isArray(result)) {
      const [lid, creator, skillOffered, skillWanted, description, isActive, createdAt] = result as unknown as [bigint, `0x${string}`, string, string, string, boolean, bigint]
      console.log(`✅ Listing ${id} (array):`, { skillOffered, skillWanted, isActive })
      return { id: lid, creator, skillOffered, skillWanted, description, isActive, createdAt }
    } else if (result && typeof result === 'object') {
      const r = result as any
      const listing: SkillListing = {
        id: BigInt(r.id ?? r[0] ?? id),
        creator: (r.creator ?? r[1]) as `0x${string}`,
        skillOffered: r.skillOffered ?? r[2] ?? '',
        skillWanted: r.skillWanted ?? r[3] ?? '',
        description: r.description ?? r[4] ?? '',
        isActive: Boolean(r.isActive ?? r[5]),
        createdAt: BigInt(r.createdAt ?? r[6] ?? 0),
      }
      console.log(`✅ Listing ${id} (object):`, { skillOffered: listing.skillOffered, isActive: listing.isActive })
      return listing
    }
    console.log(`⚠️ Listing ${id} unknown shape:`, result)
    return null
  } catch (error) {
    console.error(`❌ Error reading listing ${id}:`, error)
    return null
  }
}

export async function readUser(address: `0x${string}`) {
  try {
    return await publicClient.readContract({
      address: CONTRACT_EVM_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getUser",
      args: [address],
    })
  } catch (error) {
    console.error("Error reading user:", error)
    return null
  }
}

// Hedera may revert when returning dynamic arrays; provide robust fallbacks.
export async function readUserListings(address: `0x${string}`): Promise<bigint[]> {
  try {
    // Fallback: iterate all listings and filter by creator
    const total = await readTotalListings()
    const ids: bigint[] = []
    for (let i = 1; i <= total; i++) {
      const l = await readListing(i)
      if (l && l.isActive && l.creator.toLowerCase() === address.toLowerCase()) {
        ids.push(BigInt(i))
      }
    }
    return ids
  } catch (error) {
    console.error("Error reading user listings:", error)
    return []
  }
}

export async function readUserProposals(address: `0x${string}`): Promise<bigint[]> {
  try {
    const total = await readTotalProposals()
    const ids: bigint[] = []
    for (let i = 1; i <= total; i++) {
      const p = await readBarterProposal(i)
      if (!p) continue
      const proposer = (p as any)[2] as `0x${string}`
      const acceptor = (p as any)[3] as `0x${string}`
      if (
        (proposer && proposer.toLowerCase() === address.toLowerCase()) ||
        (acceptor && acceptor.toLowerCase() === address.toLowerCase())
      ) {
        ids.push(BigInt(i))
      }
    }
    return ids
  } catch (error) {
    console.error("Error reading user proposals:", error)
    return []
  }
}

export async function readBarterProposal(id: number) {
  try {
    return await publicClient.readContract({
      address: CONTRACT_EVM_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getBarterProposal",
      args: [BigInt(id)],
    })
  } catch (error) {
    console.error("Error reading proposal:", error)
    return null
  }
}

export async function readUserNFTs(address: `0x${string}`): Promise<bigint[]> {
  try {
    const ids = await publicClient.readContract({
      address: CONTRACT_EVM_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getUserNFTs",
      args: [address],
    })
    return ids as bigint[]
  } catch (error) {
    console.error("Error reading user NFTs:", error)
    return []
  }
}

export async function readTotalProposals(): Promise<number> {
  try {
    const result = await publicClient.readContract({
      address: CONTRACT_EVM_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getTotalProposals",
      args: [],
    })
    return Number(result as bigint)
  } catch (error) {
    console.error("Error reading total proposals:", error)
    return 0
  }
}


import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatContractId(contractId: string): string {
  return contractId
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}





