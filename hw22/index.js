var Web3 = require("web3");
require("dotenv").config({path: "./.env"});
var url = process.env.NODE_URL;

var pancakeSwapContractAddress = '0x10ed43c718714eb63d5aa57b78b54704e256024e'; // Pancake Swap contract address

var options = {
  timeout: 30000,
  clientConfig: {
    maxReceivedFrameSize: 100000000,
    maxReceivedMessageSize: 100000000,
  },
  reconnect: {
    auto: true,
    delay: 5000,
    maxAttempts: 15,
    onTimeout: false,
  },
};

var web3 = new Web3(new Web3.providers.WebsocketProvider(url, options));
const subscription = web3.eth.subscribe("pendingTransactions", (err, res) => {
  if (err) console.error(err);
});

var init = function () {
  subscription.on("data", async (txHash) => {
    try {
      let tx = await web3.eth.getTransaction(txHash);
      if (tx.to.toLowerCase() === pancakeSwapContractAddress.toLowerCase()) {
        console.log(tx);
      }
    } catch (err) {
      console.error(err);
    }
  });
};

init();
