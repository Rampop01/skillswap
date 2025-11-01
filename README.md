# SkillSwap Frontend

Frontend for the SkillSwap platform - a peer-to-peer skill exchange marketplace built on Hedera Hashgraph.

# Details
###  View on HashScan
Visit: https://hashscan.io/testnet/contract/0.0.7158163
###  Pitch Deck
https://gamma.app/docs/SkillSwap-s19017rjghdlvl9
### Link to Hedera course certificate
https://drive.google.com/file/d/1M_fZHqiJFAc2c77TpdqIPsFBem0AUzSk/view?usp=sharing
###  Live link
https://skillswap-git-frontend-rampop01s-projects.vercel.app/

## Deployment Summary

**Contract Deployed Successfully!**
- **Contract ID**: `0.0.7158163`
- **EVM Address**: `0x00000000000000000000000000000000006d3993`
- **Network**: Hedera Testnet
- **Explorer**: https://hashscan.io/testnet/contract/0.0.7158163
- **Account ID**: `0.0.6496415`

## Features

✨ **Modern UI/UX**
- Beautiful gradient designs with smooth animations
- Responsive layout that works on all devices
- Dark theme optimized for eye comfort

🎨 **Pages**
- **Home**: Landing page with features, stats, and CTA
- **Skills Browse**: Browse all available skill listings with search and filters
- **Marketplace**: Discover and trade skill exchange NFTs
- **Profile**: User profile with skills, NFTs, and trade history

🎁 **NFT System**
- Automatic NFT minting on successful skill exchanges
- NFT marketplace for buying and selling achievement NFTs
- Beautiful NFT cards with metadata and details
- Profile integration showing all earned NFTs


## Getting Started

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Home page
│   │   ├── skills/
│   │   │   └── page.tsx      # Skills browsing page
│   │   ├── marketplace/
│   │   │   └── page.tsx      # NFT marketplace page
│   │   ├── profile/
│   │   │   └── page.tsx      # User profile page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── Navbar.tsx        # Navigation bar
│   │   └── Providers.tsx     # Wallet & theme providers
│   └── lib/
│       ├── contract.ts       # Contract configuration
│       ├── utils.ts          # Utility functions
│       ├── wallet.ts         # Wallet configuration
│       └── abi.json          # Contract ABI
├── public/                   # Static assets
└── package.json
```

## Smart Contract Integration

The frontend is configured to work with the deployed SkillSwap contract:
- **Contract ID**: `0.0.7137731`
- **Network**: Hedera Testnet
- **Contract ABI**: Defined in `src/lib/contract.ts`

## Completed Features ✅

- ✅ Connect Hedera wallet (RainbowKit integration)
- ✅ Contract interaction functions
- ✅ User registration and profile management
- ✅ Skill listing creation and browsing
- ✅ Barter proposal functionality
- ✅ Real-time data from blockchain
- ✅ NFT viewing and display
- ✅ NFT marketplace for trading
- ✅ Profile NFT gallery

## Next Steps

- [ ] Implement NFT listing for sale 
- [ ] Implement NFT purchasing 
- [ ] Add NFT metadata enrichment with IPFS
- [ ] Enhanced search and filtering for marketplace
- [ ] NFT trading history and analytics

## Design Highlights

- **Color Palette**: Blue to purple gradients for primary actions
- **Typography**: Inter font for clean, modern look
- **Animations**: Smooth transitions using Framer Motion
- **Cards**: Glass-morphism effect with backdrop blur
- **Icons**: Lucide React for consistent iconography

## License


