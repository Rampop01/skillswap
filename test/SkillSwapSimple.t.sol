// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../src/SkillSwapSimple.sol";

/**
 * @title SkillSwapSimpleTest
 * @dev Simple test contract for SkillSwap functionality
 * @notice This test can be run without forge-std dependencies
 */
contract SkillSwapSimpleTest {
    SkillSwap public skillSwap;
    
    address public alice = address(0x1);
    address public bob = address(0x2);
    address public charlie = address(0x3);
    address public owner = address(0x4);

    string[] public aliceSkillsOffered = ["Web Development", "JavaScript"];
    string[] public aliceSkillsWanted = ["Graphic Design", "UI/UX"];
    
    string[] public bobSkillsOffered = ["Graphic Design", "Logo Design"];
    string[] public bobSkillsWanted = ["Web Development", "React"];

    event TestResult(string testName, bool passed, string message);

    function setUp() public {
        skillSwap = new SkillSwap();
    }

    function test_RegisterUser() public {
        // Test user registration
        skillSwap.registerUser("Alice", aliceSkillsOffered, aliceSkillsWanted);
        
        SkillSwap.User memory user = skillSwap.getUser(msg.sender);
        
        bool passed = (keccak256(bytes(user.name)) == keccak256(bytes("Alice")) &&
                      user.skillsOffered.length == 2 &&
                      user.skillsWanted.length == 2 &&
                      user.reputation == 100 &&
                      user.isRegistered &&
                      user.totalTrades == 0);
        
        emit TestResult("RegisterUser", passed, passed ? "User registered successfully" : "User registration failed");
    }

    function test_CreateSkillListing() public {
        // Setup user first
        skillSwap.registerUser("Alice", aliceSkillsOffered, aliceSkillsWanted);
        
        // Create skill listing
        skillSwap.createSkillListing("Web Development", "Graphic Design", "I'll build you a website if you design my logo");
        
        SkillSwap.SkillListing memory listing = skillSwap.getSkillListing(1);
        
        bool passed = (listing.id == 1 &&
                      listing.creator == msg.sender &&
                      keccak256(bytes(listing.skillOffered)) == keccak256(bytes("Web Development")) &&
                      keccak256(bytes(listing.skillWanted)) == keccak256(bytes("Graphic Design")) &&
                      listing.isActive);
        
        emit TestResult("CreateSkillListing", passed, passed ? "Skill listing created successfully" : "Skill listing creation failed");
    }

    function test_GetUserListings() public {
        // Setup user and create listings
        skillSwap.registerUser("Alice", aliceSkillsOffered, aliceSkillsWanted);
        skillSwap.createSkillListing("Web Development", "Graphic Design", "Description1");
        skillSwap.createSkillListing("JavaScript", "UI/UX", "Description2");
        
        uint256[] memory listings = skillSwap.getUserListings(msg.sender);
        
        bool passed = (listings.length == 2 &&
                      listings[0] == 1 &&
                      listings[1] == 2);
        
        emit TestResult("GetUserListings", passed, passed ? "User listings retrieved successfully" : "User listings retrieval failed");
    }

    function test_GetTotalListings() public {
        skillSwap.registerUser("Alice", aliceSkillsOffered, aliceSkillsWanted);
        
        bool passed = (skillSwap.getTotalListings() == 0);
        
        skillSwap.createSkillListing("Web Development", "Graphic Design", "Description");
        
        passed = passed && (skillSwap.getTotalListings() == 1);
        
        emit TestResult("GetTotalListings", passed, passed ? "Total listings count working correctly" : "Total listings count failed");
    }

    function test_GetTotalProposals() public {
        skillSwap.registerUser("Alice", aliceSkillsOffered, aliceSkillsWanted);
        skillSwap.createSkillListing("Web Development", "Graphic Design", "Description");
        
        bool passed = (skillSwap.getTotalProposals() == 0);
        
        emit TestResult("GetTotalProposals", passed, passed ? "Total proposals count working correctly" : "Total proposals count failed");
    }

    function test_ContractOwner() public {
        bool passed = (skillSwap.owner() == address(this));
        
        emit TestResult("ContractOwner", passed, passed ? "Contract owner set correctly" : "Contract owner not set correctly");
    }

    function test_UserReputation() public {
        skillSwap.registerUser("Alice", aliceSkillsOffered, aliceSkillsWanted);
        
        SkillSwap.User memory user = skillSwap.getUser(msg.sender);
        
        bool passed = (user.reputation == 100);
        
        emit TestResult("UserReputation", passed, passed ? "User reputation set correctly" : "User reputation not set correctly");
    }

    function test_UserSkills() public {
        skillSwap.registerUser("Alice", aliceSkillsOffered, aliceSkillsWanted);
        
        SkillSwap.User memory user = skillSwap.getUser(msg.sender);
        
        bool passed = (user.skillsOffered.length == 2 &&
                      user.skillsWanted.length == 2 &&
                      keccak256(bytes(user.skillsOffered[0])) == keccak256(bytes("Web Development")) &&
                      keccak256(bytes(user.skillsOffered[1])) == keccak256(bytes("JavaScript")));
        
        emit TestResult("UserSkills", passed, passed ? "User skills set correctly" : "User skills not set correctly");
    }

    function test_ListingDetails() public {
        skillSwap.registerUser("Alice", aliceSkillsOffered, aliceSkillsWanted);
        skillSwap.createSkillListing("Web Development", "Graphic Design", "Test description");
        
        SkillSwap.SkillListing memory listing = skillSwap.getSkillListing(1);
        
        bool passed = (listing.id == 1 &&
                      listing.creator == msg.sender &&
                      keccak256(bytes(listing.skillOffered)) == keccak256(bytes("Web Development")) &&
                      keccak256(bytes(listing.skillWanted)) == keccak256(bytes("Graphic Design")) &&
                      keccak256(bytes(listing.description)) == keccak256(bytes("Test description")) &&
                      listing.isActive &&
                      listing.createdAt > 0);
        
        emit TestResult("ListingDetails", passed, passed ? "Listing details correct" : "Listing details incorrect");
    }

    function test_UserRegistrationValidation() public {
        // Test empty name
        try skillSwap.registerUser("", aliceSkillsOffered, aliceSkillsWanted) {
            emit TestResult("UserRegistrationValidation", false, "Empty name should fail");
        } catch {
            emit TestResult("UserRegistrationValidation", true, "Empty name correctly rejected");
        }
    }

    function runAllTests() public {
        setUp();
        test_RegisterUser();
        test_CreateSkillListing();
        test_GetUserListings();
        test_GetTotalListings();
        test_GetTotalProposals();
        test_ContractOwner();
        test_UserReputation();
        test_UserSkills();
        test_ListingDetails();
        test_UserRegistrationValidation();
    }
}
