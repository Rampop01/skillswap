// SkillSwap Contract Configuration
export const CONTRACT_ID = "0.0.7137731"

// Hedera Network Configuration
export const HEDERA_NETWORK = "testnet"

export async function fetchContractEvmAddress(contractId: string): Promise<`0x${string}` | null> {
  try {
    const res = await fetch(`https://testnet.mirrornode.hedera.com/api/v1/contracts/${contractId}`)
    if (!res.ok) return null
    const data = await res.json()
    return (data.evm_address as string)?.startsWith("0x") ? (data.evm_address as `0x${string}`) : null
  } catch {
    return null
  }
}

// Contract ABI - This is a simplified version for frontend interaction
export const CONTRACT_ABI = [
  {
    "inputs": [{"internalType": "string", "name": "name", "type": "string"}, {"internalType": "string[]", "name": "skillsOffered", "type": "string[]"}, {"internalType": "string[]", "name": "skillsWanted", "type": "string[]"}],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "skillOffered", "type": "string"}, {"internalType": "string", "name": "skillWanted", "type": "string"}, {"internalType": "string", "name": "description", "type": "string"}],
    "name": "createSkillListing",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "listingId", "type": "uint256"}, {"internalType": "string", "name": "proposal", "type": "string"}],
    "name": "createBarterProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "proposalId", "type": "uint256"}],
    "name": "acceptBarterProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "proposalId", "type": "uint256"}],
    "name": "markBarterCompleted",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUser",
    "outputs": [{"components": [{"internalType": "string", "name": "name", "type": "string"}, {"internalType": "string[]", "name": "skillsOffered", "type": "string[]"}, {"internalType": "string[]", "name": "skillsWanted", "type": "string[]"}, {"internalType": "uint256", "name": "reputation", "type": "uint256"}, {"internalType": "bool", "name": "isRegistered", "type": "bool"}, {"internalType": "uint256", "name": "totalTrades", "type": "uint256"}], "internalType": "struct SkillSwap.User", "name": "", "type": "tuple"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "listingId", "type": "uint256"}],
    "name": "getSkillListing",
    "outputs": [{"components": [{"internalType": "uint256", "name": "id", "type": "uint256"}, {"internalType": "address", "name": "creator", "type": "address"}, {"internalType": "string", "name": "skillOffered", "type": "string"}, {"internalType": "string", "name": "skillWanted", "type": "string"}, {"internalType": "string", "name": "description", "type": "string"}, {"internalType": "bool", "name": "isActive", "type": "bool"}, {"internalType": "uint256", "name": "createdAt", "type": "uint256"}], "internalType": "struct SkillSwap.SkillListing", "name": "", "type": "tuple"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalListings",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalProposals",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
]





