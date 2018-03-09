import React, { Component } from 'react'
import $ from 'jquery';
import { keccak256 } from 'js-sha3';

import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/Asset.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x0663EfC10F32eAB78D35432D86Dceb33B94FaC11'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )
const methodsFromInterface = ABIInterfaceArray.filter( ABIinterface => !ABIinterface.constant )


class Asset extends Component {
    constructor(props) {
      super(props)
      this.state = {
        web3:null,
        database:null,
        instance:null
      }
      this.callConstant = this.callInterface.bind(this);
      this.withdrawal = this.withdrawal.bind(this);
      this.receiveIncome = this.receiveIncome.bind(this);
      this.setEventListeners = this.setEventListeners.bind(this);
    }

    async componentDidMount() {
      const { web3, database } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray);
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS));
      web3.eth.defaultAccount = web3.eth.coinbase;

      const LogSharesTraded = instance.LogSharesTraded({},{fromBlock: 0, toBlock: 'latest'});
      const LogDestruction = instance.LogDestruction({},{fromBlock: 0, toBlock: 'latest'});
      const LogIncomeReceived = instance.LogIncomeReceived({},{fromBlock: 0, toBlock: 'latest'});
      const LogInvestmentPaid = instance.LogInvestmentPaid({},{fromBlock: 0, toBlock: 'latest'});
      const LogInvestmentPaidToWithdrawalAddress = instance.LogInvestmentPaidToWithdrawalAddress({},{fromBlock: 0, toBlock: 'latest'});
      const LogAssetNote = instance.LogAssetNote({},{fromBlock: 0, toBlock: 'latest'});
      this.setState({ web3: web3, database: database, instance: instance, LogSharesTraded: LogSharesTraded,
      LogDestruction: LogDestruction, LogIncomeReceived: LogIncomeReceived, LogInvestmentPaid: LogInvestmentPaid,
      LogInvestmentPaidToWithdrawalAddress: LogInvestmentPaidToWithdrawalAddress, LogAssetNote: LogAssetNote });
      this.setEventListeners();
    }


    async callInterface(interfaceName) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`]();
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async setEventListeners(){
      const { instance, web3, LogSharesTraded,
      LogDestruction, LogIncomeReceived, LogInvestmentPaid,
      LogInvestmentPaidToWithdrawalAddress, LogAssetNote } = this.state;
      LogSharesTraded.watch(function(e,r){if(!e){alert('LogSharesTraded; ' + r);}});
      LogDestruction.watch(function(e,r){if(!e){alert('LogDestruction; ' + r);}});
      LogIncomeReceived.watch(function(e,r){if(!e){alert('LogIncomeReceived; ' + r);}});
      LogInvestmentPaid.watch(function(e,r){if(!e){alert('LogInvestmentPaid; ' + r);}});
      LogInvestmentPaidToWithdrawalAddress.watch(function(e,r){if(!e){alert('LogInvestmentPaidToWithdrawalAddress; ' + r);}});
      LogAssetNote.watch(function(e,r){if(!e){alert('LogAssetNote; ' + r);}});
    }


    async withdrawal(_assetID, _otherWithdrawal){
      const { instance, web3, database } = this.state;
      const addrSet = await database.addressStorage(keccak256("withdrawalAddress", web3.eth.coinbase));
      console.log('asset withdrawal; ' + web3.eth.coinbase);
      if(addrSet !== 'ff' &&
         addrSet !== 'dd'
       ){

      /*   instance.withdraw.estimateGas(
           _assetID, _otherWithdrawal,
           {from:web3.eth.coinbase},
           async function(e, gasEstimate){
             console.log(e);
             console.log(gasEstimate);
           }
         );*/

        const response = await instance.withdrawAsync(
         _assetID, _otherWithdrawal,
         {from:web3.eth.coinbase, gas:210000});
      }
     }


    // Used By ; Asset generating revenue
    async receiveIncome(_assetID, _note){
      const { instance, web3 } = this.state;
    /*  instance.receiveIncome.estimateGas(
        _assetID, _note,
        {from:web3.eth.coinbase},
        async function(e, gasEstimate){
        if(!e){
          console.log(gasEstimate);*/

          const response = await instance.receiveIncomeAsync(
            _assetID, _note,
            {from: web3.eth.coinbase, gas: 210000});
        //}
      //});
      }

    async getEventInfo(_object){
      var dictReturn = {
                        _contractAddr: _object.address,
                        _blockHash: _object.blockHash,
                        _blockNumber: _object.blockNumer,
                        _event: _object.event,
                        _logIndex: _object.logIndex,
                        _transactionHash: _object.transactionHash,
                        _transactionIndex: _object._transactionIndex};
      return dictReturn;
    }

    render() {
        return (
          <div>
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

            {/*TODO; Grab _assetID from bigchainDB */ }
            <br />
            {
              <button
              key={'withdrawal'}
              onClick={() => this.withdrawal(
                $('#asset-withdraw_assetID').val(),
                $('#otherWithdrawal-select :selected').val()
              )}
              >
              {'Withdrawal:'}
              </button>
          }
          _assetID:<input type="text" id="asset-withdraw_assetID"></input>
          <select id='otherWithdrawal-select'>
            <option value="true">MetaMask</option>
            <option value="false">Uphold</option>
          </select>
          <br />



          {/* Receieve Income TODO; Grab _assetID from bigchainDB */}
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'receiveIncome'}
            onClick={() => this.receiveIncome($('#asset-_assetID').val(), '_note')}
            >
            {'Receive Income'}
            </button>
        }
        _assetID:<input type="text" id="asset-_assetID"></input>


        <br />
          <br /><br />


          </div>
        );
      }
}

export default Asset;
