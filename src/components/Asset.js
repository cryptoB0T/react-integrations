import React, { Component } from 'react'

import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/AssetCreation.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x0'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )
const methodsFromInterface = ABIInterfaceArray.filter( ABIinterface => !ABIinterface.constant )


class Asset extends Component {
    constructor(props) {
      super(props)
      this.state = {
        instance:null,
        LogSharesTraded:null,
        LogDestruction:null,
        LogIncomeReceived:null,
        LogInvestmentPaid:null,
        LogInvestmentPaidToWithdrawalAddress:null,
        LogAssetNote:null,
      }
      this.callConstant = this.callInterface.bind(this);
      this.withdrawal = this.withdrawal.bind(this);
    }

    async componentDidMount() {
      const { web3 } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))
      const LogSharesTraded = instance.LogSharesTraded({},{fromBlock: 0, toBlock: 'latest'});
      const LogDestruction = instance.LogDestruction({},{fromBlock: 0, toBlock: 'latest'});
      const LogIncomeReceived = instance.LogIncomeReceived({},{fromBlock: 0, toBlock: 'latest'});
      const LogInvestmentPaid = instance.LogInvestmentPaid({},{fromBlock: 0, toBlock: 'latest'});
      const LogInvestmentPaidToWithdrawalAddress = instance.LogInvestmentPaidToWithdrawalAddress({},{fromBlock: 0, toBlock: 'latest'});
      const LogAssetNote = instance.LogAssetNote({},{fromBlock: 0, toBlock: 'latest'});
      this.setState({ web3: web3, instance: instance, LogSharesTraded : LogSharesTraded,
      LogDestruction : LogDestruction, LogIncomeReceived : LogIncomeReceived,
      LogInvestmentPaid : LogInvestmentPaid, LogInvestmentPaidToWithdrawalAddress:
      LogInvestmentPaidToWithdrawalAddress, LogAssetNote : LogAssetNote });
    }

    async callInterface(interfaceName) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`]();
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async withdrawal(_assetID, _otherWithdrawal){
      const { instance, web3 } = this.state;
      const response = await instance.withdrawAsync(_assetID, _otherWithdrawal,{
        from: web3.eth.coinbase, gas:20000});
    }

    async receiveIncome(_assetID, _note){
      const { instance, web3 } = this.state;
      const response = await instance.receiveIncomeAsync(_assetID, _note,{
        from: web3.eth.coinbase, gas:20000});
      }

    render() {
        return (
          <div>
            <br /><br />
            {
              constantsFromInterface.map( constant => (
              <button
                style={{ margin: 'auto', display: 'block' }}
                key={constant.name}
                onClick={() => this.callInterface(constant.name)}
                >
                {constant.name}
              </button>
            ))}

            {/* Withdrawal TODO; Grab _assetID from bigchainDB */}
            <br />
            {
              <button
              style={{ margin: 'auto', display: 'block' }}
              key={'withdrawal'}
              onClick={() => this.withdrawal('', false)}
              >
              {'Withdrawal'}
              </button>
          }

          {/* Receieve Income TODO; Grab _assetID from bigchainDB */}
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'receiveIncome'}
            onClick={() => this.receiveIncome('_assetID', '_note')}
            >
            {'Receive Income'}
            </button>
        }<br />

          </div>
        );
      }
}

export default Asset;
