// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "@semaphore-protocol/contracts/base/SemaphoreCore.sol";

contract HondurasVote is SemaphoreCore {
    struct Candidate {
        string name;
        string party;
        uint256 voteCount;
        bool exists;
    }

    struct Vote {
        uint256 nullifierHash;
        uint256 candidateId;
        uint256 timestamp;
    }

    ISemaphore public semaphore;
    uint256 public groupId;
    
    mapping(uint256 => Candidate) public candidates;
    mapping(uint256 => Vote) public votes;
    mapping(uint256 => bool) public nullifierHashes;
    
    uint256 public candidateCount;
    uint256 public voteCount;
    
    event CandidateAdded(uint256 indexed candidateId, string name, string party);
    event VoteCast(uint256 indexed nullifierHash, uint256 indexed candidateId, uint256 timestamp);
    event GroupCreated(uint256 indexed groupId);

    constructor(address _semaphore) {
        semaphore = ISemaphore(_semaphore);
        groupId = 1; // Default group ID for Honduras voters
    }

    modifier onlyValidCandidate(uint256 _candidateId) {
        require(candidates[_candidateId].exists, "Invalid candidate");
        _;
    }

    function addCandidate(string memory _name, string memory _party) external {
        candidateCount++;
        candidates[candidateCount] = Candidate({
            name: _name,
            party: _party,
            voteCount: 0,
            exists: true
        });
        
        emit CandidateAdded(candidateCount, _name, _party);
    }

    function castVote(
        uint256 _candidateId,
        uint256 _nullifierHash,
        uint256 _externalNullifierHash,
        uint256[8] calldata _proof
    ) external onlyValidCandidate(_candidateId) {
        require(!nullifierHashes[_nullifierHash], "Vote already cast");
        
        // Verify the Semaphore proof
        semaphore.verifyProof(
            groupId,
            _externalNullifierHash,
            _nullifierHash,
            _externalNullifierHash,
            _proof
        );
        
        // Record the vote
        nullifierHashes[_nullifierHash] = true;
        candidates[_candidateId].voteCount++;
        voteCount++;
        
        votes[voteCount] = Vote({
            nullifierHash: _nullifierHash,
            candidateId: _candidateId,
            timestamp: block.timestamp
        });
        
        emit VoteCast(_nullifierHash, _candidateId, block.timestamp);
    }

    function getCandidate(uint256 _candidateId) external view returns (
        string memory name,
        string memory party,
        uint256 voteCount,
        bool exists
    ) {
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.name, candidate.party, candidate.voteCount, candidate.exists);
    }

    function getAllCandidates() external view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidateCount);
        for (uint256 i = 1; i <= candidateCount; i++) {
            allCandidates[i - 1] = candidates[i];
        }
        return allCandidates;
    }

    function verifyVoteReceipt(uint256 _nullifierHash) external view returns (bool) {
        return nullifierHashes[_nullifierHash];
    }

    function getVoteByNullifier(uint256 _nullifierHash) external view returns (
        uint256 candidateId,
        uint256 timestamp
    ) {
        for (uint256 i = 1; i <= voteCount; i++) {
            if (votes[i].nullifierHash == _nullifierHash) {
                return (votes[i].candidateId, votes[i].timestamp);
            }
        }
        revert("Vote not found");
    }

    function getTotalVotes() external view returns (uint256) {
        return voteCount;
    }
} 