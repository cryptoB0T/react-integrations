import React, { Component } from 'react'

import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/ContractManager.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x0'
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
      this.setContractManager = this.setContractManager.bind(this);
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

    async setContractManager(_contractManager){
      const { instance, web3 } = this.state;
      const response = await instance.setContractManager(_contractManager,{
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

            {/* TODO; */}
            <br />
            {
              <button
              style={{ margin: 'auto', display: 'block' }}
              key={'setContractManager'}
              onClick={() => this.setContractManager('_contractManager')}
              >
              {'Set Contract Manager'}
              </button>
          }

          </div>
        );
      }
}

export default ContractManager;
