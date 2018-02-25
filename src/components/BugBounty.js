import React, { Component } from 'react'
import { promisifyAll } from 'bluebird'
import ABIInterfaceArray from '../util/abis/BugBounty.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x0'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )


class BugBounty extends Component {
    constructor(props) {
      super(props)
      this.state = {
        instance:null,
      }
      this.callConstant = this.callInterface.bind(this);
      this.submitBug = this.submitBug.bind(this);
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

    async submitBug(){
      const { instance, web3 } = this.state;
      const response = await instance.submitBugAsync(
        {from: web3.eth.coinbase, gas:20000}
      );
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
                {'Constant : ' + constant.name}
              </button>
            ))}

            {/*  TODO;  */}
            <br />
            {
              <button
              style={{ margin: 'auto', display: 'block' }}
              key={'submitBug'}
              onClick={() => this.submitBug()}
              >
              {'Submit Bug'}
              </button>
            }
          </div>
        );
      }
    }


export default BugBounty;
