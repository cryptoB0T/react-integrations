import React, { Component } from 'react'
import { keccak256 } from 'js-sha3';

import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/TokenBurn.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x0'
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
      this.basicVerification = this.basicVerification.bind(this);
    }

    async componentDidMount() {
      const { web3, modifier } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))
      const LogMyBitBurnt = instance.LogMyBitBurnt({},{fromBlock: 0, toBlock: 'latest'});
      const LogCallBackRecieved = instance.LogCallBackRecieved({},{fromBlock: 0, toBlock: 'latest'});
      this.setState({ web3: web3, instance: instance, modifier: modifier, LogMyBitBurnt: LogMyBitBurnt,
       LogCallBackRecieved: LogCallBackRecieved})
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
           const response = await instance.burnTokens(_accessLevelDesired,{
             from: web3.eth.coinbase, gas:20000});
         }
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
                onClick={() => this.callInterface(constant.name)}
                >
                {constant.name}
              </button>
            ))}


          {/*  TODO; */}
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'burnTokens'}
            onClick={() => this.burnTokens('_accessLevelDesired')}
            >
            {'Burn Tokens'}
            </button>
          }

          </div>
        );
      }
}

export default TokenBurn;
