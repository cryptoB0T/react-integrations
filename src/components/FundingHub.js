import React, { Component } from 'react'
import $ from 'jquery';
import { keccak256 } from 'js-sha3';

import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/FundingHub.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x729f330a684a10fcb5aac45be1f81e2ec1f4ebb9'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )

class FundingHub extends Component {
    constructor(props) {
      super(props)
      this.state = {
        instance:null,
        web3:null,
        database:null,
        modifier:null
      }
      this.callConstant = this.callInterface.bind(this);
      this.fund = this.fund.bind(this);
      this.payout = this.payout.bind(this);
      this.initiateRefund = this.initiateRefund.bind(this);
      this.refund = this.refund.bind(this);
      this.getEventInfo = this.getEventInfo.bind(this);
      this.setEventListeners = this.setEventListeners.bind(this);
    }

    async componentDidMount() {
      const { web3, database, modifier } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray);
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS));
      const LogNewFunder = instance.LogNewFunder({},{fromBlock: 0, toBlock: 'latest'});
      const LogAssetFunded = instance.LogAssetFunded({},{fromBlock: 0, toBlock: 'latest'});
      const LogAssetFundingFailed = instance.LogAssetFundingFailed({},{fromBlock: 0, toBlock: 'latest'});
      const LogAssetPayoutInstaller = instance.LogAssetPayoutInstaller({}, {fromBlock: 0, toBlock: 'latest'});
      const LogRefund = instance.LogRefund({}, {fromBlock: 0, toBlock: 'latest'});
      const LogFundingTimeChanged = instance.LogFundingTimeChanged({}, {fromBlock: 0, toBlock: 'latest'});
      const LogAssetEscrowChanged = instance.LogAssetEscrowChanged({}, {fromBlock: 0, toBlock: 'latest'});
      const LogAssetPayoutMyBitFoundation = instance.LogAssetPayoutMyBitFoundation({}, {fromBlock: 0, toBlock: 'latest'});
      const LogAssetPayoutLockedTokenHolders = instance.LogAssetPayoutLockedTokenHolders({}, {fromBlock: 0, toBlock: 'latest'});
      const LogDestruction = instance.LogDestruction({}, {fromBlock: 0, toBlock: 'latest'});

      this.setState({ web3: web3, database: database, modifier: modifier, database: database, instance: instance, LogNewFunder: LogNewFunder,
            LogAssetFunded: LogAssetFunded, LogAssetFundingFailed: LogAssetFundingFailed,
            LogAssetPayoutInstaller: LogAssetPayoutInstaller, LogRefund: LogRefund,
            LogFundingTimeChanged: LogFundingTimeChanged, LogAssetEscrowChanged: LogAssetEscrowChanged,
            LogAssetPayoutMyBitFoundation: LogAssetPayoutMyBitFoundation, LogAssetPayoutLockedTokenHolders:
            LogAssetPayoutLockedTokenHolders, LogDestruction:LogDestruction });
      this.setEventListeners();
      }


    async setEventListeners(){
      const { instance, web3, LogNewFunder, LogAssetFunded,
      LogAssetFundingFailed, LogAssetPayoutInstaller, LogRefund,
      LogFundingTimeChanged, LogAssetEscrowChanged, LogAssetPayoutMyBitFoundation,
      LogAssetPayoutLockedTokenHolders, LogDestruction} = this.state;
      LogNewFunder.watch(function(e,r){if(!e){alert('LogNewFunder; ' + r);}});
      LogAssetFunded.watch(function(e,r){if(!e){alert('LogAssetFunded; ' + r);}});
      LogAssetFundingFailed.watch(function(e,r){if(!e){alert('LogAssetFundingFailed; ' + r);}});
      LogAssetPayoutInstaller.watch(function(e,r){if(!e){alert('LogAssetPayoutInstaller; ' + r);}});
      LogRefund.watch(function(e,r){if(!e){alert('LogRefund; ' + r);}});
      LogFundingTimeChanged.watch(function(e,r){if(!e){alert('LogFundingTimeChanged; ' + r);}});
      LogAssetEscrowChanged.watch(function(e,r){if(!e){alert('LogAssetEscrowChanged; ' + r);}});
      LogAssetPayoutMyBitFoundation.watch(function(e,r){if(!e){alert('LogAssetPayoutMyBitFoundation; ' + r);}});
      LogAssetPayoutLockedTokenHolders.watch(function(e,r){if(!e){alert('LogAssetPayoutLockedTokenHolders; ' + r);}});
      LogDestruction.watch(function(e,r){if(!e){alert('LogDestruction; ' + r);}});
    }

    async callInterface(interfaceName) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`]();
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async fund(_assetID, _value){
      const { instance, web3, modifier } = this.state;
      if(modifier.fundingLimitValue(_assetID) &&
         modifier.fundingLimitTime(_assetID) &&
         modifier.onlyApproved(2) &&
         modifier.atStage(_assetID, 1) &&
         modifier.notZero(_value)
      ){
        instance.fund.estimateGas(
          _assetID,
          {from:web3.eth.coinbase, value:_value},
          async function(e,gasEstimate){
            if(!e){
              const response = await instance.fundAsync(_assetID,{
                  from: web3.eth.coinbase, gas:gasEstimate, value: _value});
                }
              })
            }
          };


    async payout(_assetID){
      const { instance, web3, modifier } = this.state;
      if(modifier.atStage(_assetID, 3) &&
         modifier.fundingPeriodOver(_assetID)
      ){
        instance.payout.estimateGas(
          _assetID,
          {from:web3.eth.coinbase},
          async function(e,gasEstimate){
            if(!e){
              const response = await instance.payoutAsync(_assetID,{
                from: web3.eth.coinbase, gas:gasEstimate});
              }
          }
        )
      }
    }

    async initiateRefund(_assetID){
      const { instance, web3, modifier} = this.state;
      const response = await instance.initiateRefundAsync(_assetID,{
        from: web3.eth.coinbase, gas:30000});
      if(modifier.fundingPeriodOver(_assetID) &&
         modifier.atStage(_assetID, 1)
      ){
        instance.initiateRefund.estimateGas(
          _assetID,
          {from:web3.eth.coinbase},
          async function(e,gasEstimate){
            if(!e){
              const response = await instance.initiateRefundAsync(_assetID,{
                from: web3.eth.coinbase, gas:gasEstimate});
              }
          }
        )
      }
    }

    async refund(_assetID){
      const { instance, web3, modifier } = this.state;
      if(modifier.atStage(_assetID, 1))
        {
          instance.refund.estimateGas(
            _assetID,
            {from:web3.eth.coinbase},
            async function(e,gasEstimate){
              if(!e){
                const response = await instance.refundAsync(_assetID,{
                from: web3.eth.coinbase, gas:gasEstimate});
              }
            }
          )
        }
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
                    Grab _assetID from bigchainDB
            */}
            <br />
            {
              <button
              key={'fund'}
              onClick={() => this.fund(
                $('#fund-_assetID').val(),
                $('#fund-_value').val()
              )}
              >
              {'Fund'}
              </button>
          }_value
          _assetID:<input type="text" id="fund-_assetID"></input>
          _value:<input type="text" id="fund-_value"></input>



          {/*  TODO;
                  Grab _assetID from bigchainDB
          */}
          <br />
          <br />
          {
            <button
            key={'payout'}
            onClick={() => this.payout(
              $('#payout-_assetID').val()
            )}
            >
            {'Payout'}
            </button>
          }
          _assetID:<input type="text" id="payout-_assetID"></input>


          {/*  TODO;
                  Grab _assetID from bigchainDB
          */}
          <br />
          <br />
          {
            <button
            key={'initiateRefund'}
            onClick={() => this.initiateRefund(
              $('#initiateRefund-_assetID').val()
            )}
            >
            {'Initiate Refund'}
            </button>
          }
          _assetID:<input type="text" id="initiateRefund-_assetID"></input>



          {/*  TODO;
                  Grab _assetID from bigchainDB
          */}
          <br />
          <br />
          {
            <button
            key={'refund'}
            onClick={() => this.refund(
              $('#refund-_assetID').val()
            )}
            >
            {'Refund'}
            </button>
          }
          _assetID:<input type="text" id="refund-_assetID"></input>

          <br /><br /><br /><br />

          </div>
        );
      }
}

export default FundingHub;
