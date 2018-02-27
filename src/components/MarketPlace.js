import React, { Component } from 'react'
import $ from 'jquery';
import { keccak256 } from 'js-sha3';

import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/MarketPlace.json'
//import {Database} from './Database.js'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x0'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )


class MarketPlace extends Component {
    constructor(props) {
      super(props)
      this.state = {
        instance:null,
        LogDestruction:null,
        LogSellOrderCreated:null,
        LogBuyOrderCreated:null,
        LogBuyOrderCompleted:null,
        LogSellOrderCompleted:null,
        }
      // database:null
      this.callInterface = this.callInterface.bind(this);
      this.buyAsset = this.buyAsset.bind(this);
      this.sellAsset = this.sellAsset.bind(this);
      this.createBuyOrder = this.createBuyOrder.bind(this);
      this.createSellOrder = this.createSellOrder.bind(this);
      this.deleteBuyOrder = this.deleteBuyOrder.bind(this);
      this.deleteSellOrder = this.deleteSellOrder.bind(this);
    }

    async componentDidMount() {
      const { web3 } = this.props;
      // const { database } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))
      const LogDestruction = instance.LogDestruction({},{fromBlock: 0, toBlock: 'latest'});
      const LogSellOrderCreated = instance.LogSellOrderCreated({},{fromBlock: 0, toBlock: 'latest'});
      const LogBuyOrderCreated = instance.LogBuyOrderCreated({},{fromBlock: 0, toBlock: 'latest'});
      const LogBuyOrderCompleted = instance.LogBuyOrderCompleted({},{fromBlock: 0, toBlock: 'latest'});
      const LogSellOrderCompleted = instance.LogSellOrderCompleted({},{fromBlock: 0, toBlock: 'latest'});
      this.setState({ web3: web3, instance: instance, LogDestruction: LogDestruction,
      LogSellOrderCompleted: LogSellOrderCompleted, LogBuyOrderCreated: LogBuyOrderCreated,
      LogBuyOrderCompleted: LogBuyOrderCompleted, LogSellOrderCompleted: LogSellOrderCompleted})
    }

    async callInterface(interfaceName, _param) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`](_param);
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    // TODO; grab assetID
    async buyAsset(_sellOrderID){
      const { instance, web3 } = this.state;
      const sellOrder = await instance.sellOrdersAsync(_sellOrderID);
      if(sellOrder.amount !== 0 ){
        var valueCost = sellOrder.amount * sellOrder.price;
        const response = await instance.buyAsset(_sellOrderID,{
          from: web3.eth.coinbase, gas:20000, value :web3.fromWei(valueCost)});
      }
    }

    // TODO; grab assetID
    async sellAsset(_buyOrderID){
      const { instance, web3 } = this.state;
      const buyOrder = await instance.buyOrdersAsync(_buyOrderID);
      if(buyOrder.amount !== 0){
        var valueCost = buyOrder.amount * buyOrder.price;
        const response = await instance.sellAsset(_buyOrderID,{
          from: web3.eth.coinbase, gas:20000, value :web3.fromWei(valueCost)
        });
      }
    }
    // TODO; grab assetID
    async createBuyOrder(_amount, _price, _assetID){
      /*const { instance, web3, database } = this.state;
      if(_amount > 0 && _price > 0){

        const assetExists = await database.uintStorageAsync(keccak256('fundingStage', _assetID));
        if(assetExists == 4){
          var valueDeposit = _amount * _price;
          const response = await instance.createBuyOrder(_amount, _price, _assetID,{
            from: web3.eth.coinbase, gas:20000, value : web3.fromWei(valueDeposit)});
            }
        }
      */
      }

    async createSellOrder(_amount, _price, _assetID){
      /*const { instance, web3, database } = this.state;
      if(_amount > 0 && _price > 0){

        const assetExists = await database.uintStorageAsync(keccak256('fundingStage', _assetID));
        if(assetExists == 4){
          var valueDeposit = _amount * _price;
          const response = await instance.createSellOrder(_amount, _price, _assetID,{
            from: web3.eth.coinbase, gas:20000, value : web3.fromWei(valueDeposit)});
            }
        }
        const response = await instance.createSellOrder(_amount, _price, _assetID,{
          from: web3.eth.coinbase, gas:20000, value :'GRABVALUE'});
      */

      }

    async deleteBuyOrder(_orderID){
      const { instance, web3 } = this.state;
      const response = await instance.deleteBuyOrder(_orderID,{
        from: web3.eth.coinbase, gas:20000, value :'GRABVALUE'});
      }

    async deleteSellOrder(_orderID){
      const { instance, web3 } = this.state;
      const response = await instance.stringAddress(_orderID,{
        from: web3.eth.coinbase, gas:20000, value :'GRABVALUE'});
      }

    async withdraw(){
      const { instance, web3 } = this.state;
      const response = await instance.withdraw({
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
