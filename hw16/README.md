first command to fork mainnet node:

```
npx hardhat node --fork <URL>
```

command to check the block number:

```
curl --data '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8545 
```

the result is:
    

    {"jsonrpc":"2.0","id":1,"result":"0x19cbdd0"}


which is correct


this command check chainId:
    
    curl --data '{"method":"eth_chainId","params":[],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8545 

result is 0x38 which is 56 in decimal



