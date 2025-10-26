// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @title SkillSwap
 * @dev A peer-to-peer skill exchange platform on Hedera
 * @notice This contract enables users to exchange skills without traditional currency
 */
contract SkillSwap {
    // Events
    event UserRegistered(address indexed user, string name, string[] skillsOffered, string[] skillsWanted);
    event SkillListingCreated(uint256 indexed listingId, address indexed creator, string skillOffered, string skillWanted, string description);
    event BarterProposalCreated(uint256 indexed proposalId, uint256 indexed listingId, address indexed proposer, string proposal);
    event BarterAccepted(uint256 indexed proposalId, address indexed acceptor);
    event BarterCompleted(uint256 indexed proposalId, uint256 indexed nftId1, uint256 indexed nftId2);
    event DisputeRaised(uint256 indexed proposalId, address indexed disputer, string reason);
    event DisputeResolved(uint256 indexed proposalId, address indexed winner);

    // Structs
    struct User {
        string name;
        string[] skillsOffered;
        string[] skillsWanted;
        uint256 reputation;
        bool isRegistered;
        uint256 totalTrades;
    }

    struct SkillListing {
        uint256 id;
        address creator;
        string skillOffered;
        string skillWanted;
        string description;
        bool isActive;
        uint256 createdAt;
    }

    struct BarterProposal {
        uint256 id;
        uint256 listingId;
        address proposer;
        address acceptor;
        string proposal;
        BarterStatus status;
        uint256 createdAt;
        uint256 completedAt;
        bool proposerCompleted;
        bool acceptorCompleted;
        address disputer;
        string disputeReason;
    }

    enum BarterStatus {
        Pending,
        Accepted,
        InProgress,
        Completed,
        Disputed,
        Cancelled
    }

    // State variables
    uint256 private _listingIds;
    uint256 private _proposalIds;
    uint256 private _nftIds;
    address public owner;

    mapping(address => User) public users;
    mapping(uint256 => SkillListing) public skillListings;
    mapping(uint256 => BarterProposal) public barterProposals;
    mapping(address => uint256[]) public userListings;
    mapping(address => uint256[]) public userProposals;
    mapping(address => uint256[]) public userNFTs;
    mapping(uint256 => address) public nftOwners;
    mapping(address => uint256) public balances;

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyRegisteredUser() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }

    modifier onlyListingOwner(uint256 listingId) {
        require(skillListings[listingId].creator == msg.sender, "Not listing owner");
        _;
    }

    modifier onlyProposalParticipant(uint256 proposalId) {
        BarterProposal memory proposal = barterProposals[proposalId];
        require(proposal.proposer == msg.sender || proposal.acceptor == msg.sender, "Not proposal participant");
        _;
    }

    modifier validListing(uint256 listingId) {
        require(skillListings[listingId].isActive, "Listing not active");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Register a new user with their skills
     * @param name User's display name
     * @param skillsOffered Array of skills the user can offer
     * @param skillsWanted Array of skills the user wants to learn
     */
    function registerUser(
        string memory name,
        string[] memory skillsOffered,
        string[] memory skillsWanted
    ) external {
        require(!users[msg.sender].isRegistered, "User already registered");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(skillsOffered.length > 0, "Must offer at least one skill");

        users[msg.sender] = User({
            name: name,
            skillsOffered: skillsOffered,
            skillsWanted: skillsWanted,
            reputation: 100, // Starting reputation
            isRegistered: true,
            totalTrades: 0
        });

        emit UserRegistered(msg.sender, name, skillsOffered, skillsWanted);
    }

    /**
     * @dev Create a skill listing
     * @param skillOffered The skill being offered
     * @param skillWanted The skill wanted in return
     * @param description Detailed description of the exchange
     */
    function createSkillListing(
        string memory skillOffered,
        string memory skillWanted,
        string memory description
    ) external onlyRegisteredUser {
        require(bytes(skillOffered).length > 0, "Skill offered cannot be empty");
        require(bytes(skillWanted).length > 0, "Skill wanted cannot be empty");

        _listingIds++;
        uint256 listingId = _listingIds;

        skillListings[listingId] = SkillListing({
            id: listingId,
            creator: msg.sender,
            skillOffered: skillOffered,
            skillWanted: skillWanted,
            description: description,
            isActive: true,
            createdAt: block.timestamp
        });

        userListings[msg.sender].push(listingId);

        emit SkillListingCreated(listingId, msg.sender, skillOffered, skillWanted, description);
    }

    /**
     * @dev Create a barter proposal for a skill listing
     * @param listingId The ID of the skill listing
     * @param proposal The proposed exchange details
     */
    function createBarterProposal(
        uint256 listingId,
        string memory proposal
    ) external onlyRegisteredUser validListing(listingId) {
        require(skillListings[listingId].creator != msg.sender, "Cannot propose to own listing");
        require(bytes(proposal).length > 0, "Proposal cannot be empty");

        _proposalIds++;
        uint256 proposalId = _proposalIds;

        barterProposals[proposalId] = BarterProposal({
            id: proposalId,
            listingId: listingId,
            proposer: msg.sender,
            acceptor: address(0),
            proposal: proposal,
            status: BarterStatus.Pending,
            createdAt: block.timestamp,
            completedAt: 0,
            proposerCompleted: false,
            acceptorCompleted: false,
            disputer: address(0),
            disputeReason: ""
        });

        userProposals[msg.sender].push(proposalId);

        emit BarterProposalCreated(proposalId, listingId, msg.sender, proposal);
    }

    /**
     * @dev Accept a barter proposal
     * @param proposalId The ID of the proposal to accept
     */
    function acceptBarterProposal(uint256 proposalId) external onlyRegisteredUser {
        BarterProposal storage proposal = barterProposals[proposalId];
        require(proposal.status == BarterStatus.Pending, "Proposal not pending");
        require(skillListings[proposal.listingId].creator == msg.sender, "Not listing owner");

        proposal.acceptor = msg.sender;
        proposal.status = BarterStatus.Accepted;

        userProposals[msg.sender].push(proposalId);

        emit BarterAccepted(proposalId, msg.sender);
    }

    /**
     * @dev Mark a barter as completed by the caller
     * @param proposalId The ID of the proposal
     */
    function markBarterCompleted(uint256 proposalId) external onlyProposalParticipant(proposalId) {
        BarterProposal storage proposal = barterProposals[proposalId];
        require(proposal.status == BarterStatus.Accepted, "Proposal not accepted");

        if (msg.sender == proposal.proposer) {
            proposal.proposerCompleted = true;
        } else {
            proposal.acceptorCompleted = true;
        }

        // If both parties have completed, finalize the barter
        if (proposal.proposerCompleted && proposal.acceptorCompleted) {
            _finalizeBarter(proposalId);
        }
    }

    /**
     * @dev Raise a dispute for a barter
     * @param proposalId The ID of the proposal
     * @param reason The reason for the dispute
     */
    function raiseDispute(uint256 proposalId, string memory reason) external onlyProposalParticipant(proposalId) {
        BarterProposal storage proposal = barterProposals[proposalId];
        require(proposal.status == BarterStatus.Accepted, "Proposal not accepted");
        require(proposal.disputer == address(0), "Dispute already raised");

        proposal.status = BarterStatus.Disputed;
        proposal.disputer = msg.sender;
        proposal.disputeReason = reason;

        emit DisputeRaised(proposalId, msg.sender, reason);
    }

    /**
     * @dev Resolve a dispute (only owner for now, can be extended to DAO)
     * @param proposalId The ID of the proposal
     * @param winner The address of the winning party
     */
    function resolveDispute(uint256 proposalId, address winner) external onlyOwner {
        BarterProposal storage proposal = barterProposals[proposalId];
        require(proposal.status == BarterStatus.Disputed, "No dispute to resolve");
        require(winner == proposal.proposer || winner == proposal.acceptor, "Invalid winner");

        // Award reputation points to winner, deduct from loser
        address loser = winner == proposal.proposer ? proposal.acceptor : proposal.proposer;
        
        users[winner].reputation += 10;
        if (users[loser].reputation > 10) {
            users[loser].reputation -= 10;
        }

        proposal.status = BarterStatus.Completed;
        proposal.completedAt = block.timestamp;

        emit DisputeResolved(proposalId, winner);
    }

    /**
     * @dev Internal function to finalize a completed barter
     * @param proposalId The ID of the proposal
     */
    function _finalizeBarter(uint256 proposalId) internal {
        BarterProposal storage proposal = barterProposals[proposalId];
        
        proposal.status = BarterStatus.Completed;
        proposal.completedAt = block.timestamp;

        // Mint NFTs for both parties (simplified version)
        _nftIds++;
        uint256 nftId1 = _nftIds;
        nftOwners[nftId1] = proposal.proposer;
        userNFTs[proposal.proposer].push(nftId1);

        _nftIds++;
        uint256 nftId2 = _nftIds;
        nftOwners[nftId2] = proposal.acceptor;
        userNFTs[proposal.acceptor].push(nftId2);

        // Update user statistics
        users[proposal.proposer].totalTrades++;
        users[proposal.acceptor].totalTrades++;
        users[proposal.proposer].reputation += 5;
        users[proposal.acceptor].reputation += 5;

        emit BarterCompleted(proposalId, nftId1, nftId2);
    }

    /**
     * @dev Get user information
     * @param user The user address
     * @return User struct containing user information
     */
    function getUser(address user) external view returns (User memory) {
        return users[user];
    }

    /**
     * @dev Get skill listing information
     * @param listingId The listing ID
     * @return SkillListing struct
     */
    function getSkillListing(uint256 listingId) external view returns (SkillListing memory) {
        return skillListings[listingId];
    }

    /**
     * @dev Get barter proposal information
     * @param proposalId The proposal ID
     * @return BarterProposal struct
     */
    function getBarterProposal(uint256 proposalId) external view returns (BarterProposal memory) {
        return barterProposals[proposalId];
    }

    /**
     * @dev Get user's listings
     * @param user The user address
     * @return Array of listing IDs
     */
    function getUserListings(address user) external view returns (uint256[] memory) {
        return userListings[user];
    }

    /**
     * @dev Get user's proposals
     * @param user The user address
     * @return Array of proposal IDs
     */
    function getUserProposals(address user) external view returns (uint256[] memory) {
        return userProposals[user];
    }

    /**
     * @dev Get user's NFTs
     * @param user The user address
     * @return Array of NFT IDs
     */
    function getUserNFTs(address user) external view returns (uint256[] memory) {
        return userNFTs[user];
    }

    /**
     * @dev Get total number of listings
     * @return Total listing count
     */
    function getTotalListings() external view returns (uint256) {
        return _listingIds;
    }

    /**
     * @dev Get total number of proposals
     * @return Total proposal count
     */
    function getTotalProposals() external view returns (uint256) {
        return _proposalIds;
    }

    /**
     * @dev Get NFT owner
     * @param tokenId The NFT token ID
     * @return Owner address
     */
    function ownerOf(uint256 tokenId) external view returns (address) {
        require(nftOwners[tokenId] != address(0), "Token does not exist");
        return nftOwners[tokenId];
    }

    /**
     * @dev Get NFT balance for a user
     * @param user The user address
     * @return Number of NFTs owned
     */
    function balanceOf(address user) external view returns (uint256) {
        return userNFTs[user].length;
    }

    /**
     * @dev Check if NFT exists
     * @param tokenId The NFT token ID
     * @return True if NFT exists
     */
    function exists(uint256 tokenId) external view returns (bool) {
        return nftOwners[tokenId] != address(0);
    }
}
