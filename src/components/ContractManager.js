import React, { Component } from 'react'

import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/ContractManager.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0xDB6584b6E2A107b5139955453Ac1AA63E528eeD3'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )
const methodsFromInterface = ABIInterfaceArray.filter( ABIinterface => !ABIinterface.constant )


class ContractManager extends Component {
    constructor(props) {
      super(props)
      this.state = {
        instance:null,
      }
      this.callConstant = this.callInterface.bind(this);
      this.setContractManagerAddress = this.setContractManagerAddress.bind(this);
    }

    async componentDidMount() {
      const { web3 } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))
      this.setState({ web3: web3, instance: instance })
    }

    async callInterface(interfaceName) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`]();
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async setContractManagerAddress(_contractManager){
      const { instance, web3 } = this.state;

      /*instance.voteForBug.gasEstimate(
        _contractManager,
        {from:web3.eth.coinbase},
        async function(e, gasEstimate){
          if(!e){
            const response = await instance.setContractManagerAsync(_contractManager,{
              from: web3.eth.coinbase, gas:gasEstimate});
          }
        }
      )*/
      const response = await instance.setContractManagerAsync(_contractManager,{
        from: web3.eth.coinbase, gas:210000});
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

            {/* TODO; */}
            <br />
            {
              <button
              style={{ margin: 'auto', display: 'block' }}
              key={'setContractManager'}
              onClick={() => this.setContractManagerAddress('_contractManager')}
              >
              {'PRIVATE DO NOT PRESS'}
              </button>
          }
          <br /><br /><br /><br />
          </div>
        );
      }
}

export default ContractManager;
