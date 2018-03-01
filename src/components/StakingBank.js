import React, { Component } from 'react'
import $ from 'jquery';
import { keccak256 } from 'js-sha3';

import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/BugBounty.json'
// TODO; update .json

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x0'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )

class StakingBank extends Component {
    constructor(props) {
      super(props)
      this.state = {
        instance:null,
        web3:null,
        database:null,
        LogDestruction:null,
        LogFeeReceived:null,
        LogTokensStaked:null,
        LogTokenWithdraw:null
      }
      this.callConstant = this.callInterface.bind(this);
      this.requestWithdraw = this.requestWithdraw.bind(this);
      this.withdraw = this.withdraw.bind(this);
      this.getEventInfo = this.getEventInfo.bind(this);
    }

    async componentDidMount() {
      const { web3, database, modifier } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))
      const LogDestruction = instance.LogNewFunder({},{fromBlock: 0, toBlock: 'latest'});
      const LogFeeReceived = instance.LogAssetFunded({},{fromBlock: 0, toBlock: 'latest'});
      const LogTokensStaked = instance.LogAssetFundingFailed({},{fromBlock: 0, toBlock: 'latest'});
      const LogTokenWithdraw = instance.LogAssetPayoutInstaller({}, {fromBlock: 0, toBlock: 'latest'});
      this.setState({ web3: web3, database: database, modifier: modifier, instance: instance,
         LogDestruction: LogDestruction, LogFeeReceived: LogFeeReceived,
         LogTokensStaked: LogTokensStaked, LogTokenWithdraw: LogTokenWithdraw})
    }

    async callInterface(interfaceName) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`]();
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    // TODO; stake_ID bigchainDB
    async requestWithdraw(_stakeID){
      const { instance, web3} = this.state;

        const response = await instance.requestWithdrawAsync(_stakeID,{
            from: web3.eth.coinbase, gas:20000})
        }

    async withdraw(_stakeID){
      const { instance, web3 } = this.state;

      const response = await instance.withdrawAsync(_stakeID,{
          from: web3.eth.coinbase, gas:20000})
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
      this.LogDestruction.watch(function(e,r){
        if(!e){
          var eventInfo = this.getEventInfo(r);
          var _locationSent = r._locationSent;
          var _amountSent = r._amountSent;
          var _caller = r._caller;
        }
      });

      { /*Store these in bigchainDB*/}
      this.LogFeeReceived.watch(function(e,r){
        if(!e){
          var eventInfo = this.getEventInfo(r);
          var _sender = r._sender;
          var _amount = r._amount;
          var _blockNumber = r._blockNumber;
          }
      });

      { /*Store these in bigchainDB*/}
      this.LogTokensStaked.watch(function(e,r){
        if(!e){
          var eventInfo = this.getEventInfo(r);
          var _staker = r._staker;
          var _blockNumber = r._blockNumber;
          var _ID = r._ID;
        }
      });

      { /*Store these in bigchainDB*/}
      this.LogTokenWithdraw.watch(function(e,r){
        if(!e){
          var eventInfo = this.getEventInfo(r);
          var _staker = r._staker;
          var _blockNumber = r._blockNumber;
          var _ID = r._ID;
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

            {/*  TODO;
                    Grab _stakeID from bigchainDB
            */}
            <br />
            {
              <button
              key={'requestWithdraw'}
              onClick={() => this.requestWithdraw(
                $('#stakingBankRequestWithdraw-_stakeID').val()
              )}
              >
              {'Request Withdraw'}
              </button>
          }
          _stakeID:<input type="text" id="stakingBankRequestWithdraw-_stakeID"></input>


          {/*  TODO;
                  Grab _assetID from bigchainDB
          */}
          <br />
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'payout'}
            onClick={() => this.withdraw(
              $('#payout-_assetID').val()
            )}
            >
            {'Payout'}
            </button>
          }
          _stakeID:<input type="text" id="StakingBankWithdraw-_stakeID"></input>


          {/*  TODO;
                  Grab _assetID from bigchainDB
          */}
          <br />
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'receiveReward'}
            onClick={() => this.receiveReward(
              $('#StakingBankreceiveReward-value').val()
            )}
            >
            {'receiveReward'}
            </button>
          }
          _value:<input type="text" id="StakingBankreceiveReward-value"></input>



          </div>
        );
      }
}

export default StakingBank;
