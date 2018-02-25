import React, { Component } from 'react'

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
        instance:null,
        LogMyBitBurnt:null,
        LogCallBackRecieved:null,
      }
      this.callInterface = this.buyOrders.bind(this);
      this.burnQuery = this.buyAsset.bind(this);
      this.burnTokens = this.sellAsset.bind(this);
      this.createBuyOrder = this.createBuyOrder.bind(this);
      this.createSellOrder = this.createSellOrder.bind(this);
      this.deleteBuyOrder = this.deleteBuyOrder.bind(this);
      this.deleteSellOrder = this.deleteSellOrder.bind(this);
    }

    async componentDidMount() {
      const { web3 } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))
      const LogMyBitBurnt = instance.LogMyBitBurnt({},{fromBlock: 0, toBlock: 'latest'});
      const LogCallBackRecieved = instance.LogCallBackRecieved({},{fromBlock: 0, toBlock: 'latest'});
      this.setState({ web3: web3, instance: instance, LogMyBitBurnt: LogMyBitBurnt,
       LogCallBackRecieved: LogCallBackRecieved})
    }

    async callInterface(interfaceName) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`]();
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async burnQuery(_accessLevelDesired){
      const { instance, web3 } = this.state;
      const response = await instance.burnQuery(_accessLevelDesired,{
        from: web3.eth.coinbase, gas:20000});
    }

    async burnTokens(_accessLevelDesired){
      const { instance, web3 } = this.state;
      const response = await instance.burnTokens(_accessLevelDesired,{
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
              key={'burnQuery'}
              onClick={() => this.burnQuery('_accessLevelDesired')}
              >
              {'Burn Query'}
              </button>
          }

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
