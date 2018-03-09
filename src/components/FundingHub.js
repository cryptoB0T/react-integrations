import React, { Component } from 'react'
import $ from 'jquery';
import { keccak256 } from 'js-sha3';

import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/FundingHub.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x6E9e0AcB899de022a121488FaAa1c735931f4892'
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
      const { web3, database } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray);

      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS));
      const LogNewFunder = instance.LogNewFunder({},{fromBlock: 0, toBlock: 'latest'});
      const LogAssetFunded = instance.LogAssetFunded({},{fromBlock: 0, toBlock: 'latest'});
      const LogAssetFundingFailed = instance.LogAssetFundingFailed({},{fromBlock: 0, toBlock: 'latest'});
      const LogRefund = instance.LogRefund({}, {fromBlock: 0, toBlock: 'latest'});
      const LogAssetPayout = instance.LogAssetPayout({}, {fromBlock: 0, toBlock: 'latest'});
      const LogAssetEscrowChanged = instance.LogAssetEscrowChanged({}, {fromBlock: 0, toBlock: 'latest'});
      const LogDestruction = instance.LogDestruction({}, {fromBlock: 0, toBlock: 'latest'});

      this.setState({ web3: web3, database: database, database: database, instance: instance, LogNewFunder: LogNewFunder,
            LogAssetFunded: LogAssetFunded, LogAssetFundingFailed: LogAssetFundingFailed,
            LogRefund: LogRefund, LogAssetPayout: LogAssetPayout,
            LogAssetEscrowChanged: LogAssetEscrowChanged, LogDestruction: LogDestruction});
      this.setEventListeners();
      }


    async setEventListeners(){
      const { instance, web3, LogNewFunder, LogAssetFunded,
      LogAssetFundingFailed, LogRefund,
      LogAssetPayout, LogAssetEscrowChanged, LogDestruction} = this.state;
      LogNewFunder.watch(function(e,r){if(!e){alert('LogNewFunder; ' + r);}});
      LogAssetFunded.watch(function(e,r){if(!e){alert('LogAssetFunded; ' + r);}});
      LogAssetFundingFailed.watch(function(e,r){if(!e){alert('LogAssetFundingFailed; ' + r);}});
      LogRefund.watch(function(e,r){if(!e){alert('LogRefund; ' + r);}});
      LogAssetPayout.watch(function(e,r){if(!e){alert('LogAssetEscrowChanged; ' + r);}});
      LogAssetEscrowChanged.watch(function(e,r){if(!e){alert('LogAssetEscrowChanged; ' + r);}});
      LogDestruction.watch(function(e,r){if(!e){alert('LogDestruction; ' + r);}});
    }

    async callInterface(interfaceName) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`]();
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async fund(_assetID, _value){
      const { instance, web3, database } = this.state;
       var amountRaised = await database.uintStorage(keccak256("amountRaised", _assetID));
       var amountToBeRaised = await database.uintStorage(keccak256("amountToBeRaised", _assetID));
       var currentDate = new Date().getTime();
       var fundingDeadline = await database.uintStorage(keccak256("fundingDeadline", _assetID));
       var userAccessLevel = await database.uintStorage(keccak256("userAccess", web3.eth.coinbase));
       var assetStage = await database.uintStorage(keccak256("fundingStage", _assetID));
       alert(amountRaised);
      if(amountRaised < amountToBeRaised &&
         currentDate < fundingDeadline &&
         userAccessLevel >= 2 &&
         assetStage === 1  &&
         _value > 0
      ){
        /*instance.fund.estimateGas(
          _assetID,
          {from:web3.eth.coinbase, value:_value},
          async function(e,gasEstimate){
            if(!e){
              const response = await instance.fundAsync(_assetID,{
                  from: web3.eth.coinbase, gas:gasEstimate, value: _value});
                }
              })
            }*/
      const response = await instance.fundAsync(_assetID,{
          from: web3.eth.coinbase, gas:210000, value: web3.toWei(_value, 'ether')});
          }
        };


    async payout(_assetID){
      const { instance, web3, database } = this.state;
      var assetStage = await database.uintStorage(keccak256("fundingStage", _assetID));
      var currentDate = new Date().getTime();
      var fundingDeadline = await database.uintStorage(keccak256("fundingDeadline", _assetID));

      if(assetStage === 3 &&
         currentDate > fundingDeadline
      ){
        /*instance.payout.estimateGas(
          _assetID,
          {from:web3.eth.coinbase},
          async function(e,gasEstimate){
            if(!e){
              const response = await instance.payoutAsync(_assetID,{
                from: web3.eth.coinbase, gas:gasEstimate});
              }
          }
        )*/
        const response = await instance.payoutAsync(_assetID,{
          from: web3.eth.coinbase, gas:210000});
      }
    }

    async initiateRefund(_assetID){
      const { instance, web3, database} = this.state;
      var currentDate = new Date().getTime();
      var fundingDeadline = await database.uintStorage(keccak256("fundingDeadline", _assetID));
      var assetStage = await database.uintStorage(keccak256("fundingStage", _assetID));

      if(
        currentDate > fundingDeadline &&
         assetStage === 1
      ){
        /*instance.initiateRefund.estimateGas(
          _assetID,
          {from:web3.eth.coinbase},
          async function(e,gasEstimate){
            if(!e){
              const response = await instance.initiateRefundAsync(_assetID,{
                from: web3.eth.coinbase, gas:gasEstimate});
              }
          }
        )*/
        const response = await instance.initiateRefundAsync(_assetID,{
          from: web3.eth.coinbase, gas:210000});
      }
    }

    async refund(_assetID){
      const { instance, web3, database } = this.state;
      var assetStage = await database.uintStorage(keccak256("fundingStage", _assetID));
      if(assetStage == 1)
        {
          /*instance.refund.estimateGas(
            _assetID,
            {from:web3.eth.coinbase},
            async function(e,gasEstimate){
              if(!e){
                const response = await instance.refundAsync(_assetID,{
                from: web3.eth.coinbase, gas:gasEstimate});
              }
            }
          )*/
          const response = await instance.refundAsync(_assetID,{
          from: web3.eth.coinbase, gas:210000});
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
