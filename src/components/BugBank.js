import React, { Component } from 'react'
import { promisifyAll } from 'bluebird'
import ABIInterfaceArray from '../util/abis/BugEscrow.json'
// TODO; update .json

const SMART_CONTRACT_ADDRESS = '0x0'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})


class BugBank extends Component {
    constructor(props) {
      super(props)
      this.state = {
        web3:null,
        instance:null,
      }
      this.callConstant = this.callInterface.bind(this);
      this.withdraw = this.withdraw.bind(this);
      this.calculateOwed = this.calculateOwed.bind(this);
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

    async withdraw(){
      const { instance, web3 } = this.state;
      const response = await instance.withdrawAsync(
        {from: web3.eth.coinbase, gas:20000}
      );
    }

    async calculateOwed(){
      const { instance, web3 } = this.state;
      const response = await instance.calculateOwedAsync(
        web3.eth.coinbase,
        {from: web3.eth.coinbase, gas:20000}
      );
    }

    render() {
        return (
          <div>
            {/*  TODO;  */}

            <br />
            {
              <button
              style={{ margin: 'auto', display: 'block' }}
              key={'withdraw'}
              onClick={() => this.withdraw()}
              >
              {'withdraw'}
              </button>
            }

            <br />
            <br />
            {
              <button
              style={{ margin: 'auto', display: 'block' }}
              key={'calculateOwed'}
              onClick={() => this.calculateOwed()}
              >
              {'Calculate Owed'}
              </button>
            }

          </div>
        );
      }
    }


export default BugBank;
