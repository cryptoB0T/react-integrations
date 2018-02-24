import React, { Component } from 'react';
import { promisifyAll } from 'bluebird'

import { getWeb3Async } from './util/web3'
import ABIInterfaceArray from './util/ABI.json'

import Accounts from './components/Accounts'

import './App.css';

const SMART_CONTRACT_INSTANCE = '0xb3b18AfbE291E50E652ba5e3faFAbf0b566b804B'

const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})

const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )
const methodsFromInterface = ABIInterfaceArray.filter( ABIinterface => !ABIinterface.constant )


class Web3App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      instance: null,
      isWeb3synced: false,
    }
    this.callInterface = this.callInterface.bind(this)
  }
  async callInterface(interfaceName) {
    const { instance } = this.state;
    const response = await instance[`${interfaceName}Async`]();
    alert(`The result from calling ${interfaceName} is ${response}`);
  }
  
  async componentDidMount() {
    const web3 = await getWeb3Async()
    if(web3.isConnected()) {
      
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_INSTANCE))
      
      console.log('Interface', ABIInterfaceArray)
      this.setState({ web3: web3, isWeb3synced: true, instance: instance })
    }
  }
  render() {
    const { web3, isWeb3synced } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Web3.js React Integration Example</h1>
        </header>
        { 
          isWeb3synced ?
          <div className="App-wrapper">
            <p className="App-intro">
              MetaMask was loaded properly.
            </p>
            <Accounts web3={web3} />
            <p className="App-intro">
              Smart Contract Information
            </p>
            <div>
              <span> Your constants are: </span>
              <br/>
              <div style={{ textAlign: 'center' }}>
              {
                constantsFromInterface.map( constant => (
                  <button 
                    style={{ margin: 'auto', display: 'block' }}
                    key={constant.name}
                    onClick={() => this.callInterface(constant.name)}
                    >
                    {constant.name}
                  </button>
                ))
              }
              </div>
              <br/>
              <span> Your methods are (requires parameters): </span>
              <pre>
              {
                methodsFromInterface.map( method => (
                  <span 
                    key={method.name} 
                    style={{ display: 'block' }}
                    >
                    {method.name}
                  </span>
                ))
              }
              </pre>
              
            </div>
          </div>
          :
          <p className="App-intro">
            To get started, connect to your MetaMask account
          </p>
        }
      </div>
    );
  }
}

export default Web3App;
