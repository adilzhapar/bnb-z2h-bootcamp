require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path: "./.env"});
require('@openzeppelin/hardhat-upgrades');


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  
  solidity: "0.8.18",
  networks: {
    goerli: {
      url: process.env.ALCHEMY_API_KEY_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    bnbTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://bscscan.com/
    apiKey: process.env.BSC_API_KEY,
  },
};