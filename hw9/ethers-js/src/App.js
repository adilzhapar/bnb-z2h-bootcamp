import {React} from 'react';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import abi from './utils/BadgerCoin.json';

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const contractAddress = "0xaF82f201B8D6b3921C30C43b071B49160Dce84F9";
  const contractAbi = abi.abi;
  const [amount, setAmount] = useState(0);
  const [reciever, setReciever] = useState("");

  const handleInput = (e) => {
    setAmount(parseInt(e.target.value));
  }

  const handleAddressInput = (e) => {
    setReciever(e.target.value);
  }


  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const getBalance = async () => {
    console.log("get Balance function works");
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);

        let balance = await contract.getBalance(currentAccount);
        setCurrentBalance(ethers.utils.parseEther(balance))
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleTransaction = async () => {
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);

        let sending = await contract.transfer(reciever, amount);
        await sending.wait().then(() => alert("Transaction Successful!"));

      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected();


  });



  return (
    <div className="App">
      <h1>Hello from Zhaparka's BadgerCoin</h1>
      {!currentAccount && (
          <button className="btn" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      <button className="btn" onClick={getBalance}>
        Get Balance
      </button>
      {currentBalance !== "" && (
        <h2>Current Balance: {currentBalance}</h2>
      )}
      <div className='sendTkn'>

        <input type="text" onChange={handleAddressInput} placeholder='reciever address'></input>
        <input type="text" onChange={handleInput} placeholder='amount'></input>
        <button className='btn' onClick={handleTransaction}>Send BadgerCoin</button>

      </div>
    </div>
  );
}

export default App;
