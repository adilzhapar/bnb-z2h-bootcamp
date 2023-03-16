## Homework 6

Had to use HardHat, because there are several problems on verifying the contract with library imports

- Link to the verified contract
https://testnet.bscscan.com/address/0x41626E9D642591549d177a0052ca900c48Eb3e22

command to test the contract
```
npx hardhat test
```

deploy and verify:
```
npx hardhat run scripts/deploy.js --network bscTestnet
npx hardhat verify -- network bscTestnet 0x41626E9D642591549d177a0052ca900c48Eb3e22
```