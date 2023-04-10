const { ethers, upgrades } = require("hardhat");

const contract_address = "0x10ED43C718714eb63d5aA57B78B54704E256024E";

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