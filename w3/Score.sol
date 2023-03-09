// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.6;

contract Score {
    uint256 public score;
    address public owner;

    event ScoreSet(uint256);

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    constructor() {
        score = 5;
        emit ScoreSet(5);
        owner = msg.sender;
    }

    function setScore(uint256 _score) public onlyOwner {
        score = _score;
        emit ScoreSet(_score);
    }
}