import React, { Component } from 'react'
import { keccak256 } from 'js-sha3';
import $ from 'jquery'


import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/TokenBurn.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x299ad791cd98face8cda6a65c4897449779bb4f0'
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
      this.burnTokens = this.burnTokens.bind(this);
      this.getEventInfo = this.getEventInfo.bind(this);
    }

    async componentDidMount() {
      const { web3, modifier } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))
      this.setState({ web3: web3, instance: instance, modifier: modifier})
    }

    async callInterface(interfaceName) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`]();
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async burnTokens(_accessLevelDesired){
      const { instance, web3, modifier } = this.state;
      if(modifier.accessLevel() >=1 &&
         modifier.accessLevel() < _accessLevelDesired &&
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
            onClick={() => this.burnTokens($('#tokenburn-_accessLevelDesired').val())}
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
