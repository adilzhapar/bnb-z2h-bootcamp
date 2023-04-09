const { ethers, upgrades } = require("hardhat");

const UPGRADEABLE_PROXY = "0x967Ce04570E080EC9f2dBE7DF5D7dee01e2a3a9d";

async function main() {
   const gas = await ethers.provider.getGasPrice()
   const V2Contract = await ethers.getContractFactory("Upgraded");
   console.log("Upgrading V1Contract...");
   let upgrade = await upgrades.upgradeProxy(UPGRADEABLE_PROXY, V2Contract, {
      gasPrice: gas
   });
   console.log("V1 Upgraded to V2");
   console.log("V2 Contract Deployed To:", upgrade.address)
}

main().catch((error) => {
   console.error(error);
   process.exitCode = 1;
 });