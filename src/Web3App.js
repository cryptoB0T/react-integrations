import React, { Component } from 'react';
import { promisifyAll } from 'bluebird'

import { getWeb3Async } from './util/web3'
import Database from './util/Database'
import Modifiers from './util/Modifiers'

import ABIInterfaceArray from './util/abis/ABI.json'

import Accounts from './components/Accounts'
import Asset from './components/Asset'
import AssetCreation from './components/AssetCreation'
import BugEscrow from './components/BugEscrow'
import BugBounty from './components/BugBounty'
import ContractManager from './components/ContractManager'
import FundingHub from './components/FundingHub'
import HashFunctions from './components/HashFunctions'
import MarketPlace from './components/MarketPlace'
import TokenBurn from './components/TokenBurn'
import UserAccess from './components/UserAccess'
import WithdrawalManager from './components/WithdrawalManager'

import './App.css';

class Web3App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      isWeb3synced: false,
    }
    this.divVisibility = this.divVisibility.bind(this);
  }

  async componentDidMount() {
    const web3 = await getWeb3Async()
    if(web3.isConnected()) {
      this.setState({ web3: web3, isWeb3synced: true})
    }
  }

  divVisibility(){
   var x = this.refs.hashFunctionsDiv;
      if (x.style.display === "none") {
          x.style.display = "block";
      } else {
          x.style.display = "none";
      }
  }

  render() {
    const { web3, isWeb3synced } = this.state;

    const databaseInstance = new Database();
    databaseInstance.load(web3)

    const modifierInstance = new Modifiers();
    modifierInstance.load(databaseInstance, web3);


    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Web3.js React Integration Example</h1>
        </header>
        {
          isWeb3synced ?
          <div className="App-wrapper">
            <button onClick={this.divVisibility.bind()}>AssetContract</button>
            <br />
            <div ref ='accountsDiv' style={{display: 'none'}}>
              <Accounts web3={web3} />
            </div>
            <div ref ='assetDiv' style={{display: 'none'}}>
              <Asset
                web3={web3}
                Database ={databaseInstance}
                 />
            </div>
            <div ref ='assetCreationDiv' style={{display: 'none'}}>
              <AssetCreation
                web3={web3}
                Database ={databaseInstance}
                 />
            </div>
            <div ref ='bugBountyDiv' style={{display: 'none'}}>
              <BugBounty web3={web3} />
            </div>
            <div ref ='bugEscrowDiv' style={{display: 'none'}}>
              <BugEscrow web3={web3} />
            </div>
            <div ref ='contractManagerDiv' style={{display: 'none'}}>
              <ContractManager web3={web3} />
            </div>
            <div ref ='fundingHubDiv' style={{display: 'none'}}>
              <FundingHub
                web3={web3}
                database={databaseInstance}
                modifier={modifierInstance}
                />
            </div>
            <div ref ='hashFunctionsDiv' style={{display: 'none'}}>
              <HashFunctions web3={web3} />
            </div>
            <div ref ='marketPlaceDiv' style={{display: 'none'}}>
              <MarketPlace
                web3={web3}
                database={databaseInstance}
                modifier={modifierInstance}
                />
            </div>
            <div ref ='tokenBurnDiv' style={{display: 'none'}}>
              <TokenBurn
                 web3={web3}
                 modifier={modifierInstance}
               />
            </div>
            <div ref ='userAccessDiv' style={{display: 'none'}}>
              <UserAccess
                web3={web3}
                modifier={modifierInstance}
                />
            </div>
            <div ref ='withdrawalManagerDiv' style={{display: 'none'}}>
              <WithdrawalManager
                 web3={web3}
                 modifier={modifierInstance}
                 />
            </div>


        </div>
          :
          <p className="App-intro">
            To get started, connect to your MetaMask account
          </p>
        }
      </div>
    );
  }
}

export default Web3App;
