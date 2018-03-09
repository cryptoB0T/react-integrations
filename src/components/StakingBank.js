import React, { Component } from 'react'
import $ from 'jquery';
import { keccak256 } from 'js-sha3';

import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/StakingBank.json'
// TODO; update .json

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x97A0a9189e2f8E662Eb2dE8000b3B95b5e8A6f8D'
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
      this.requestWithdrawal = this.requestWithdrawal.bind(this);
      this.withdrawal = this.withdrawal.bind(this);
      this.getEventInfo = this.getEventInfo.bind(this);
      this.bugWithdrawal = this.bugWithdrawal.bind(this);
      this.setEventListeners = this.setEventListeners.bind(this);
    }

    async componentDidMount() {
      const { web3, database, modifier } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))
      const LogDestruction = instance.LogDestruction({},{fromBlock: 0, toBlock: 'latest'});
      const LogFeeReceived = instance.LogFeeReceived({},{fromBlock: 0, toBlock: 'latest'});
      const LogTokensStaked = instance.LogTokensStaked({},{fromBlock: 0, toBlock: 'latest'});
      const LogTokenWithdraw = instance.LogTokenWithdraw({}, {fromBlock: 0, toBlock: 'latest'});
      this.setState({ web3: web3, database: database, modifier: modifier, database: database, instance: instance,
         LogDestruction: LogDestruction, LogFeeReceived: LogFeeReceived,
         LogTokensStaked: LogTokensStaked, LogTokenWithdraw: LogTokenWithdraw});
      this.setEventListeners();
    }

    async callInterface(interfaceName) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`]();
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async setEventListeners(){
      const { instance, web3, LogDestruction, LogFeeReceived,
      LogTokensStaked, LogTokenWithdraw} = this.state;
      LogDestruction.watch(function(e,r){if(!e){alert('LogDestruction; ' + r);}});
      LogFeeReceived.watch(function(e,r){if(!e){alert('LogFeeReceived; ' + r);}});
      LogTokensStaked.watch(function(e,r){if(!e){alert('LogTokensStaked; ' + r);}});
      LogTokenWithdraw.watch(function(e,r){if(!e){alert('LogTokenWithdraw; ' + r);}});
    }


    // TODO; stake_ID bigchainDB
    async requestWithdrawal(_stakeID){
      const { instance, web3 } = this.state;
      /*instance.requestWithdraw.estimateGas(
          _stakeID,
          {from:web3.eth.coinbase},
          async function(e, gasEstimate){
            if(!e){
              const response = await instance.requestWithdrawAsync(_stakeID,{
                  from: web3.eth.coinbase, gas:gasEstimate});
            }
          }
        )*/
        const response = await instance.requestWithdrawAsync(_stakeID,{
            from: web3.eth.coinbase, gas:210000});
      }

    async withdrawal(_stakeID){
      const { instance, web3 } = this.state;
    /*  instance.withdraw.estimateGas(
          _stakeID,
          {from:web3.eth.coinbase},
          async function(e, gasEstimate){
            if(!e){
              const response = await instance.withdrawAsync(_stakeID,{
                  from: web3.eth.coinbase, gas:gasEstimate})
              }
            }
          )*/

        const response = await instance.withdrawAsync(_stakeID,{
            from: web3.eth.coinbase, gas:210000});
        }

    async bugWithdrawal(_amount, _userAddress){
      const { instance, web3 } = this.state;
      /*instance.bugWithdraw.estimateGas(
          _amount, _userAddress,
          {from:web3.eth.coinbase},
          async function(e, gasEstimate){
            if(!e){
              const response = await instance.bugWithdrawAsync(_amount, _userAddress,{
                  from: web3.eth.coinbase, gas:gasEstimate});
            }
          }
        )*/
        const response = await instance.bugWithdrawAsync(_amount, _userAddress,{
            from: web3.eth.coinbase, gas:210000});
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

            {/*  TODO;
                    Grab _stakeID from bigchainDB
            */}
            <br />
            {
              <button
              key={'requestWithdraw'}
              onClick={() => this.requestWithdrawal(
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
            onClick={() => this.withdrawal(
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
            key={'bugWithdraw'}
            onClick={() => this.bugWithdrawal(
              $('#stakingBankBugWithdraw-_amount').val(),
              $('#stakingBankBugWithdraw-_userAddress').val()

            )}
            >
            {'Bug Withdraw'}
            </button>
          }
          _amount:<input type="text" id="stakingBankBugWithdraw-_amount"></input>
          _userAddress:<input type="text" id="stakingBankBugWithdraw-_userAddress"></input>

          <br /><br /><br /><br />
          </div>
        );
      }
}

export default StakingBank;
