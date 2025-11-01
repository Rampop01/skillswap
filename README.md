## Deployment Summary

**Contract Deployed Successfully!**
- **Contract ID**: `0.0.7158163`
- **EVM Address**: `0x00000000000000000000000000000000006d3993`
- **Network**: Hedera Testnet
- **Explorer**: https://hashscan.io/testnet/contract/0.0.7158163
- **Account ID**: `0.0.6496415`

### Core Features
- **User Registration**: Users can register with their skills offered and wanted
- **Skill Listings**: Create listings for skill exchanges
- **Barter Proposals**: Propose skill exchanges with other users
- **NFT System**: Mint NFTs as proof of completed skill exchanges
- **Dispute Resolution**: Raise and resolve disputes for failed exchanges
- **Reputation System**: Track user reputation and total trades

### Smart Contract Functions
- `registerUser()` - Register new users
- `createSkillListing()` - Create skill listings
- `createBarterProposal()` - Propose skill exchanges
- `acceptBarterProposal()` - Accept proposals
- `markBarterCompleted()` - Mark exchanges as complete
- `raiseDispute()` - Raise disputes
- `resolveDispute()` - Resolve disputes


# Details
###  View on HashScan
Visit: https://hashscan.io/testnet/contract/0.0.7158163
###  Pitch Deck
https://gamma.app/docs/SkillSwap-s19017rjghdlvl9
### Link to Hedera course certificate
https://drive.google.com/file/d/1M_fZHqiJFAc2c77TpdqIPsFBem0AUzSk/view?usp=sharing
###  Live link
https://skillswap-git-frontend-rampop01s-projects.vercel.app/

### 3. Build Frontend
Create a web application to interact with the deployed contract:
- Connect to Hedera wallet (HashPack, Blade)
- Register users
- Create skill listings
- Browse available skills
- Propose and accept exchanges
- Track NFT achievements

### 4. Contract Interaction Examples

#### Register a User
```javascript
const contract = new Contract(contractId, abi, client);
await contract.registerUser(
    "John Doe",
    ["Web Development", "JavaScript"],
    ["Design", "Marketing"]
);
```

#### Create a Skill Listing
```javascript
await contract.createSkillListing(
    "Web Development",
    "Design",
    "I'll build your website in exchange for logo design"
);
```

#### Create a Barter Proposal
```javascript
await contract.createBarterProposal(
    listingId,
    "I can help with your website design in exchange for logo work"
);
```

## Contract ABI

The contract ABI is available in the compiled output at:
`out/SkillSwapSimple.sol/SkillSwap.json`

## Files Created

- `deployment-testnet-${timestamp}.json` - Deployment information
- `deploy.js` - Working deployment script
- `.env` - Environment variables with your credentials

## Security Notes

- ✅ Private keys are stored securely in `.env`
- ✅ Contract deployed to testnet (safe for testing)
- ✅ All functions include proper access controls
- ✅ Dispute resolution system in place

