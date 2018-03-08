import React, { Component } from 'react'
import { keccak256 } from 'js-sha3';
import $ from 'jquery'


import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/TokenBurn.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0xe91ea7502d4bcf6092ba8523348f5deba2f75cd9'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )


class TokenBurn extends Component {
    constructor(props) {
      super(props)
      this.state = {
        web3:null,
        instance:null,
        modifier:null,
        LogMyBitBurnt:null,
        LogCallBackRecieved:null,
      }
      this.callInterface = this.callInterface.bind(this);
      this.burnToken = this.burnToken.bind(this);
      this.getEventInfo = this.getEventInfo.bind(this);
      this.setEventListeners = this.setEventListeners.bind(this);
    }

    async componentDidMount() {
      const { web3, modifier, database } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))
      const LogMyBitBurnt = instance.LogMyBitBurnt({},{fromBlock: 0, toBlock: 'latest'});
      const LogCallBackRecieved = instance.LogCallBackRecieved({},{fromBlock: 0, toBlock: 'latest'});
      this.setState({ web3: web3, instance: instance, modifier: modifier, database: database,LogMyBitBurnt: LogMyBitBurnt,
       LogCallBackRecieved: LogCallBackRecieved});
      this.setEventListeners();
    }

    async callInterface(interfaceName) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`]();
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async setEventListeners(){
      const { instance, web3, LogMyBitBurnt, LogCallBackRecieved} = this.state;
      LogMyBitBurnt.watch(function(e,r){if(!e){alert('LogMyBitBurnt; ' + r);}});
      LogCallBackRecieved.watch(function(e,r){if(!e){alert('LogCallBackRecieved; ' + r);}});
    }


    async burnToken(_accessLevelDesired){
      const { instance, web3, modifier, database } = this.state;
      var currentAccess = await database.uintStorage(keccak256("userAccess", web3.eth.coinbase));

      if(currentAccess >=1 &&
         currentAccess < _accessLevelDesired &&
         _accessLevelDesired < 5){
           instance.burnTokens.estimateGas(
               _accessLevelDesired,
               {from:web3.eth.coinbase},
               async function(e, gasEstimate){
                 if(!e){
                   const response = await instance.burnTokensAsync(_accessLevelDesired,{
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


          {/*  TODO; */}
          <br />
          {
            <button
            key={'burnTokens'}
            onClick={() => this.burnToken($('#tokenburn-_accessLevelDesired').val())}
            >
            {'Burn Tokens'}
            </button>
          }
          <select id='tokenburn-_accessLevelDesired'>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <br /><br /><br /><br />
          </div>
        );
      }
}

export default TokenBurn;
