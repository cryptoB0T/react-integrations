import React, { Component } from 'react'
import $ from 'jquery';
import { keccak256 } from 'js-sha3';

import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/MarketPlace.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x0'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )


class MarketPlace extends Component {
    constructor(props) {
      super(props)
      this.state = {
        web3:null,
        database:null,
        instance:null,
        modifier:null,
        LogDestruction:null,
        LogSellOrderCreated:null,
        LogBuyOrderCreated:null,
        LogBuyOrderCompleted:null,
        LogSellOrderCompleted:null,
        }
      this.callInterface = this.callInterface.bind(this);
      this.buyAsset = this.buyAsset.bind(this);
      this.sellAsset = this.sellAsset.bind(this);
      this.createBuyOrder = this.createBuyOrder.bind(this);
      this.createSellOrder = this.createSellOrder.bind(this);
      this.deleteBuyOrder = this.deleteBuyOrder.bind(this);
      this.deleteSellOrder = this.deleteSellOrder.bind(this);
      this.buyOrderExists = this.buyOrderExists.bind(this);
      this.sellOrderExists = this.sellOrderExists.bind(this);
      this.needsToWithdraw = this.needsToWithdraw.bind(this);
    }

    async componentDidMount() {
      const { web3, database, modifier} = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))
      const LogDestruction = instance.LogDestruction({},{fromBlock: 0, toBlock: 'latest'});
      const LogSellOrderCreated = instance.LogSellOrderCreated({},{fromBlock: 0, toBlock: 'latest'});
      const LogBuyOrderCreated = instance.LogBuyOrderCreated({},{fromBlock: 0, toBlock: 'latest'});
      const LogBuyOrderCompleted = instance.LogBuyOrderCompleted({},{fromBlock: 0, toBlock: 'latest'});
      const LogSellOrderCompleted = instance.LogSellOrderCompleted({},{fromBlock: 0, toBlock: 'latest'});
      this.setState({ web3: web3, database: database, modifier: modifier, instance: instance, LogDestruction: LogDestruction,
      LogSellOrderCompleted: LogSellOrderCompleted, LogBuyOrderCreated: LogBuyOrderCreated,
      LogBuyOrderCompleted: LogBuyOrderCompleted, LogSellOrderCompleted: LogSellOrderCompleted})
    }

    async callInterface(interfaceName, _param) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`](_param);
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    // TODO; grab _sellOrderID
    async buyAsset(_sellOrderID){
      const { instance, web3, modifier } = this.state;
      if(this.sellOrderExists(_sellOrderID)){
        var sellOrder = instance.sellOrdersAsync(_sellOrderID);

        if(modifier.onlyApproved(4) &&
           this.needsToWithdraw(
             sellOrder.assetContract,
             sellOrder.initiator)){
          var valueCost = sellOrder.amount * sellOrder.price;
          const response = await instance.buyAsset(_sellOrderID,{
            from: web3.eth.coinbase, gas:20000, value :web3.fromWei(valueCost)});
        }
      }
    }

    // TODO; grab assetID
    async sellAsset(_buyOrderID){
      const { instance, web3, modifier } = this.state;
      if(this.buyOrderExists(_buyOrderID)){
        var buyOrder = instance.buyOrdersAsync(_buyOrderID);

        if(modifier.onlyApproved(4) &&
           this.needsToWithdraw(
             buyOrder.assetContract,
             web3.eth.coinbase)
           ){
             var valueCost = buyOrder.amount * buyOrder.price;
             const response = await instance.sellAsset(_buyOrderID,{
               from: web3.eth.coinbase, gas:20000, value :web3.fromWei(valueCost)
             });
         }
       }
     }

    // TODO; grab assetID
    async createBuyOrder(_amount, _price, _assetID){
      const { instance, web3, modifier } = this.state;

      if(modifier.notZero(_amount) &&
         modifier.notZero(_price) &&
         modifier.onlyApproved(4) &&
         modifier.atStage(_assetID, 4)
        ){
          var valueDeposit = _amount * _price;
          const response = await instance.createBuyOrder(_amount, _price, _assetID,{
            from: web3.eth.coinbase, gas:20000, value : web3.fromWei(valueDeposit)});
            }
        }


    async createSellOrder(_amount, _price, _assetID){
      const { instance, web3, modifier } = this.state;
      if(modifier.notZero(_amount) &&
         modifier.notZero(_price) &&
         modifier.onlyApproved(4) &&
         modifier.atStage(_assetID, 4) &&
         modifier.hasEnoughShares(_assetID, _amount)
       ){
         var valueDeposit = _amount * _price;
         const response = await instance.createSellOrder(_amount, _price, _assetID,{
           from: web3.eth.coinbase, gas:20000, value : web3.fromWei(valueDeposit)});
       }
     }

    async deleteBuyOrder(_orderID){
      const { instance, web3, modifier } = this.state;
      if(modifier.onlyApproved(4)){
        const response = await instance.deleteBuyOrder(_orderID,{
          from: web3.eth.coinbase, gas:20000});
        }
      }

    async deleteSellOrder(_orderID){
      const { instance, web3, modifier } = this.state;
      if(modifier.onlyApproved(4)){
        const response = await instance.deleteSellOrder(_orderID,{
          from: web3.eth.coinbase, gas:20000});
        }
      }

    async withdraw(){
      const { instance, web3, modifier } = this.state;
        if(modifier.onlyApproved(4)){
        const response = await instance.withdraw({
          from: web3.eth.coinbase, gas:20000});
        }
      }

    async buyOrderExists(_orderID) {
      const { instance } = this.state;
      return (instance.buyOrders[_orderID].amount !== 0);
      }

    async sellOrderExists(_orderID) {
      const { instance } = this.state;
      return (instance.sellOrders[_orderID].amount !== 0);
      }

    async needsToWithdraw(_assetID, _seller) {
      const { database } = this.state;
      var totalReceived = database.uintStorage(keccak256("totalReceived", _assetID));
      var payment1 = totalReceived * database.uintStorage(keccak256("shares", _assetID, _seller));
      var payment2 = payment1 / database.uintStorage(keccak256("amountRaised", _assetID));
      var finalPayment = payment2 - database.uintStorage(keccak256("totalPaidToFunder", _assetID, _seller));
      return (finalPayment === 0);
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
                onClick={() => this.callInterface(constant.name, '_param')}
                >
                {constant.name}
              </button>
            ))}

            <br />
            {
              <button
              style={{ margin: 'auto', display: 'block' }}
              key={'buyAsset'}
              onClick={() => this.buyAsset(
                $('#buyAsset-_sellOrderID').val()
              )}
              >
              {'Buy Asset'}
              </button>
          }
          _sellOrderID:<input type="text" id="buyAsset-_sellOrderID"></input>


          <br />
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'sellAsset'}
            onClick={() => this.sellAsset('_buyOrderID')}
            >
            {'Sell Asset'}
            </button>
          }

          {/*  TODO;  */}
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'createBuyOrder'}
            onClick={() => this.createBuyOrder('_amount', '_price', '_assetID')}
            >
            {'Create Buy Order'}
            </button>
          }

          {/*  TODO;  */}
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'createSellOrder'}
            onClick={() => this.createSellOrder('_amount', '_price', '_assetID')}
            >
            {'Create Sell Order'}
            </button>
          }

          {/*  TODO;  */}
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'deleteBuyOrder'}
            onClick={() => this.deleteBuyOrder('_name')}
            >
            {'Delete Buy Order'}
            </button>
          }

          {/*  TODO;  */}
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'deleteSellOrder'}
            onClick={() => this.deleteSellOrder('_orderID')}
            >
            {'Delete Sell Order'}
            </button>
          }

          {/*  TODO;  */}
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'withdraw'}
            onClick={() => this.withdraw()}
            >
            {'Withdraw'}
            </button>
          }

          </div>
        );
      }
}

export default MarketPlace;
