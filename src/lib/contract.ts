// SkillSwap Contract Configuration
export const CONTRACT_ID = "0.0.7158163"
export const CONTRACT_EVM_ADDRESS = "0x00000000000000000000000000000000006d3993"

// Hedera Network Configuration
export const HEDERA_NETWORK = "testnet"

// Import the actual ABI
import CONTRACT_ABI_DATA from './abi.json'
export const CONTRACT_ABI = CONTRACT_ABI_DATA

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

// Cached contract address to avoid repeated lookups
let cachedEvmAddress: `0x${string}` | null = null

export async function getContractAddress(): Promise<`0x${string}` | null> {
  if (cachedEvmAddress) return cachedEvmAddress
  const addr = await fetchContractEvmAddress(CONTRACT_ID)
  if (addr) cachedEvmAddress = addr
  return addr
}

export type SkillListing = {
  id: bigint
  creator: `0x${string}`
  skillOffered: string
  skillWanted: string
  description: string
  isActive: boolean
  createdAt: bigint
}