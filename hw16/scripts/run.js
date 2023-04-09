const { Contract } = require("hardhat/internal/hardhat-network/stack-traces/model");

require("@nomiclabs/hardhat-web3");
require("dotenv").config({path: "./.env"});

let abi = require('../utils/Pancake.json');


Contract.setProvider('http://localhost:8545/');

let contract = new Contract(abi, process.env.CONTRACT_ADDRESS);

contract.methods.factory().call().then(console.log);