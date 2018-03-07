import React, { Component } from 'react';
import { promisifyAll } from 'bluebird'

import { getWeb3Async } from './util/web3'
import Database from './util/Database'
import Modifier from './util/Modifier'
import AssetCreationUtil from './util/components/AssetCreationUtil'
import AssetUtil from './util/components/AssetUtil'
import BugBankUtil from './util/components/BugBankUtil'
import BugBountyUtil from './util/components/BugBountyUtil'
import ContractManagerUtil from './util/components/ContractManagerUtil'
import FundingHubUtil from './util/components/FundingHubUtil'
import StakingBankUtil from './util/components/StakingBankUtil'
import TokenBurnUtil from './util/components/TokenBurnUtil'
import UserAccessUtil from './util/components/UserAccessUtil'
import WithdrawalManagerUtil from './util/components/WithdrawalManagerUtil'


import Accounts from './components/Accounts'
import Asset from './components/Asset'
import AssetCreation from './components/AssetCreation'
import BugBank from './components/BugBank'
import BugBounty from './components/BugBounty'
import ContractManager from './components/ContractManager'
import FundingHub from './components/FundingHub'
import HashFunctions from './components/HashFunctions'
import MarketPlace from './components/MarketPlace'
import StakingBank from './components/StakingBank'
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
  }

  async componentDidMount() {
    const web3 = await getWeb3Async();
    if(web3.isConnected()) {
      const databaseInstance = new Database();
      const modifierInstance = new Modifier();
      const assetCreationInstance = new AssetCreationUtil();
      const assetInstance = new AssetUtil();
      const bugBankInstance = new BugBankUtil();
      const bugBountyInstance = new BugBountyUtil();
      const contractManangerInstance = new ContractManagerUtil();
      const fundingHubInstance = new FundingHubUtil();
      const stakingBankInstance = new StakingBankUtil();
      const tokenBurnInstance = new TokenBurnUtil();
      const userAccessInstance = new UserAccessUtil();
      const withdrawalManagerInstance = new WithdrawalManagerUtil();

      databaseInstance.load(web3);
      modifierInstance.load(databaseInstance, web3);
      assetCreationInstance.load(web3, databaseInstance);
      assetInstance.load(web3, databaseInstance);
      bugBankInstance.load(web3, databaseInstance);
      bugBountyInstance.load(web3, databaseInstance);
      contractManangerInstance.load(web3);
      fundingHubInstance.load(web3, modifierInstance);
      stakingBankInstance.load(web3);
      tokenBurnInstance.load(web3);
      userAccessInstance.load(web3, modifierInstance);
      withdrawalManagerInstance.load(web3, modifierInstance);

      this.setState({ web3: web3, isWeb3synced: true, databaseInstance:
        databaseInstance, modifierInstance: modifierInstance, assetCreationInstance:
        assetCreationInstance, assetInstance: assetInstance, bugBankInstance:
        bugBankInstance, bugBountyInstance: bugBountyInstance, contractManangerInstance:
        contractManangerInstance, fundingHubInstance: fundingHubInstance,
        stakingBankInstance: stakingBankInstance, tokenBurnInstance: tokenBurnInstance,
        userAccessInstance: userAccessInstance, withdrawalManagerInstance:
        withdrawalManagerInstance})
    }
  }


  render() {
    const { web3, isWeb3synced, databaseInstance, modifierInstance} = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Web3.js React Integration Example</h1>
        </header>
        {
          isWeb3synced ?
          <div className="App-wrapper">

            <br />
            <div ref ='accountsDiv' >
              <Accounts web3={web3} />
            </div>
            <div ref ='assetDiv' >
              <h1>Asset Contract</h1>
              <Asset
                web3={web3}
                database ={databaseInstance}
                 />
            </div>
            <div ref ='assetCreationDiv' >
              <h1>Asset Creation Contract</h1>
              <AssetCreation
                web3={web3}
                database ={databaseInstance}
                 />
            </div>
            <div ref ='bugBankDiv' >
              <h1>Bug Bank Contract</h1>
              <BugBank
                web3={web3}
                database ={databaseInstance}
                 />
            </div>
            <div ref ='bugBountyDiv' >
              <h1>Bug Bounty Contract</h1>
              <BugBounty web3={web3} />
            </div>

            <div ref ='contractManagerDiv' >
              <h1>Contract Manager Contract</h1>
              <ContractManager web3={web3} />
            </div>
            <div ref ='fundingHubDiv' >
              <h1>Funding Hub Contract</h1>
              <FundingHub
                web3={web3}
                database={databaseInstance}
                modifier={modifierInstance}
                />
            </div>
            <div ref ='hashFunctionsDiv' >
              <h1>Hash Functions Contract</h1>
              <HashFunctions web3={web3} />
            </div>
            <div ref ='marketPlaceDiv' >
              <h1>Marketplace Contract</h1>
              <MarketPlace
                web3={web3}
                database={databaseInstance}
                modifier={modifierInstance}
                />
            </div>
            <div ref ='stakingBankDiv' >
              <h1>Staking Bank Contract</h1>
              <StakingBank
                web3={web3}
                database={databaseInstance}
                modifier={modifierInstance}
                />
            </div>
            <div ref ='tokenBurnDiv' >
              <h1>Token Burn Contract</h1>
              <TokenBurn
                 web3={web3}
                 modifier={modifierInstance}
                 database={databaseInstance}
               />
            </div>
            <div ref ='userAccessDiv' >
              <h1>User Access Contract</h1>
              <UserAccess
                web3={web3}
                modifier={modifierInstance}
                database={databaseInstance}
                />
            </div>
            <div ref ='withdrawalManagerDiv' >
              <h1>Withdrawal Manager Contract</h1>
              <WithdrawalManager
                 web3={web3}
                 modifier={modifierInstance}
                 database={databaseInstance}
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
