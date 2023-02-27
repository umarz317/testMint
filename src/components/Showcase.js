import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../constants/abi.json"
import address from "../constants/address.json"
import INFURA_ENDPOINT from "./config";
import Web3 from 'web3';
// eslint-disable-next-line
const provider = new ethers.providers.Web3Provider(new Web3.providers.HttpProvider(INFURA_ENDPOINT));

const Showcase = (props) => {

  const [counter, setCounter] = useState(5);

  /* eslint-disable */
  const [account, setAccount] = useState("")

  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)

  const [contract, setContract] = useState(null)

  const [connected,setConnected] = useState("...")

  const [balance,setBalance] = useState('...')

  useEffect(() => {
    connectWallet()
  }, [])
/* eslint-enable */






const connectWallet = async () => {
  if (window.ethereum) {
    if (window.ethereum.networkVersion != null) {
      console.log(window.ethereum.networkVersion)
      if (!(window.ethereum.networkVersion === "5")) {
        alert("Switch your network to Goreli")
        return
      }
    }

    if (!account) { // Only connect wallet if account is not set
      window.ethereum.request({ method: 'eth_requestAccounts' }).then((res) => {
        if (res.length > 0) {
          accountChanged(res[0])
        } 
      })
    }

  } else {
    loadEthersProperties()
  }
}

  const accountChanged = (newAcc) => {
    setAccount(newAcc)
    setConnected(true)
    loadEthersProperties()
  }

  const loadEthersProperties = async() => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(tempProvider)

    let tempSigner = tempProvider.getSigner()
    setBalance(ethers.utils.formatEther(await tempSigner.getBalance()))
    setSigner(tempSigner)

    let tempContract = new ethers.Contract(address.address, abi, tempSigner)
    setContract(tempContract)
  }

  const mint = async () => {
    try {
      console.log(contract,counter)
      await contract.mintBatch(counter, { value: ethers.utils.parseEther((counter * 0.002).toString()) })
     
    } catch (err) {
      alert(`A problem happened during mint.\n${err.reason === undefined ? err.message : err.reason}`)
    }
  }


     
    
  

  return (
    <section className="showcase font">
      <div style={{marginTop:'20px',textAlign:'center'}}>
      <h1>Connected: {connected?'True':'False'}</h1>
      <h2>Account: {account}</h2>
      <h1>Balance: {balance}</h1>
      
      </div>
          <div style={{marginTop:'10px'}} className="mint-container flex">
            <div style={{textAlign:'center'}}>
              <div className="mintInput">
                <button className="mintCount"
                  onClick={() => {
                    setCounter(counter - 1);
                    if (counter <= 1) {
                      setCounter(1);
                    }
                  }}
                >
                  -
                </button>
                <span  className="mintCount" style={{fontWeight:'bolder',marginLeft:'20px'}}> {counter} </span>
                <button style={{marginLeft:'15px'}} className="mintCount" onClick={() => setCounter(counter + 1)}> + </button>
              </div>

              <button className="mint-button" onClick={mint}>Mint</button>

            </div>
          </div>
      
    </section>
  );
};

export default Showcase;
