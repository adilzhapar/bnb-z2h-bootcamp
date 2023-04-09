require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path: "./.env"});
require("@nomiclabs/hardhat-web3");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      chainId: 56,
      forking: {
        url: process.env.qnEndpoint,
      },
    },
  },
  solidity: "0.8.18",
};