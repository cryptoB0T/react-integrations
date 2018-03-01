import React, { Component } from 'react'
import $ from 'jquery';
import { keccak256 } from 'js-sha3';

import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/AssetCreation.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x6722B25cF9DaA928AbcB8c61c2CA585466695DbF'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )
const methodsFromInterface = ABIInterfaceArray.filter( ABIinterface => !ABIinterface.constant )


class Asset extends Component {
    constructor(props) {
      super(props)
      this.state = {
        web3:null,
        database:null,
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
      this.receiveIncome = this.receiveIncome.bind(this);
      this.getEventInfo = this.getEventInfo.bind(this);
    }

    async componentDidMount() {
      const { web3, database } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))
      const LogSharesTraded = instance.LogSharesTraded({},{fromBlock: 0, toBlock: 'latest'});
      const LogDestruction = instance.LogDestruction({},{fromBlock: 0, toBlock: 'latest'});
      const LogIncomeReceived = instance.LogIncomeReceived({},{fromBlock: 0, toBlock: 'latest'});
      const LogInvestmentPaid = instance.LogInvestmentPaid({},{fromBlock: 0, toBlock: 'latest'});
      const LogInvestmentPaidToWithdrawalAddress = instance.LogInvestmentPaidToWithdrawalAddress({},{fromBlock: 0, toBlock: 'latest'});
      const LogAssetNote = instance.LogAssetNote({},{fromBlock: 0, toBlock: 'latest'});

      this.setState({ web3: web3, database: database, instance: instance, LogSharesTraded : LogSharesTraded,
      LogDestruction : LogDestruction, LogIncomeReceived : LogIncomeReceived,
      LogInvestmentPaid : LogInvestmentPaid, LogInvestmentPaidToWithdrawalAddress:
      LogInvestmentPaidToWithdrawalAddress, LogAssetNote : LogAssetNote,  });
    }

    async callInterface(interfaceName) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`]();
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async withdrawal(_assetID, _otherWithdrawal){
      const { instance, web3, database } = this.state;
      const addrSet = database.addressStorageAsync(keccak256("withdrawalAddress", web3.eth.coinbase));
      if(addrSet !== '0x0' && addrSet !== '0'){
        const response = await instance.withdrawAsync(_assetID, _otherWithdrawal,{
          from: web3.eth.coinbase, gas: 200000});
        }
    }

    // Used By ; Asset generating revenue
    async receiveIncome(_assetID, _note){
      const { instance, web3 } = this.state;
      alert('test');
      const response = await instance.receiveIncomeAsync(_assetID, _note,{
        from: web3.eth.coinbase});
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

      { /*Store these in bigchainDB*/}
      this.LogSharesTraded.watch(function(e,r){
        if(!e){
          var eventInfo = this.getEventInfo(r);
          var _assetID = r._assetID;
          var _from = r._from;
          var _to = r._to;
          var _timestamp = r._timestamp;
        }
      });

      { /*Store these in bigchainDB*/}
      this.LogDestruction.watch(function(e,r){
        if(!e){
          var eventInfo = this.getEventInfo(r);
          var _locationSent = r._locationSent;
          var _amountSent = r._amountSent;
          var _caller = r._caller;
          }
      });

      { /*Store these in bigchainDB*/}
      this.LogIncomeReceived.watch(function(e,r){
        if(!e){
          var eventInfo = this.getEventInfo(r);
          var _sender = r._sender;
          var _amount = r._amount;
          var _assetID = r._assetID;
        }
      });

      { /*Store these in bigchainDB*/}
      this.LogInvestmentPaid.watch(function(e,r){
        if(!e){
          var eventInfo = this.getEventInfo(r);
          var _funder = r._funder;
          var _amount = r._amount;
          var _timestamp = r._timestamp;
        }
      });

      { /*Store these in bigchainDB*/}
      this.LogInvestmentPaidToWithdrawalAddress.watch(function(e,r){
        if(!e){
          var eventInfo = this.getEventInfo(r);
          var _funder = r._funder;
          var _withdrawalAddress = r._withdrawalAddress;
          var _amount = r._amount;
          var _timestamp = r._timestamp;
        }
      });

      { /*Store these in bigchainDB*/}
      this.LogAssetNote.watch(function(e,r){
        if(!e){
          var eventInfo = this.getEventInfo(r);
          var _note = r._note;
          var _timestamp = r._timestamp;
        }
      });




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

            {/*TODO; Grab _assetID from bigchainDB */ }
            <br />
            {
              <button
              key={'withdrawal'}
              onClick={() => this.withdrawal('_assetID', $('#otherWithdrawal-select :selected').val())}
              >
              {'Withdrawal:'}
              </button>
          }
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

          </div>
        );
      }
}

export default Asset;
