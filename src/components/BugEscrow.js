import React, { Component } from 'react'
import { promisifyAll } from 'bluebird'
import ABIInterfaceArray from '../util/abis/BugEscrow.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x0'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )


class BugEscrow extends Component {
    constructor(props) {
      super(props)
      this.state = {
        instance:null,
        LogFeeReceived:null,
      }
      this.callConstant = this.callInterface.bind(this);
      this.receiveTransactionFee = this.receiveTransactionFee.bind(this);
    }

    async componentDidMount() {
      const { web3 } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))
      const LogFeeReceived = instance.LogFeeReceived({},{fromBlock: 0, toBlock: 'latest'});
      this.setState({ web3: web3, instance: instance, LogFeeReceived: LogFeeReceived })
    }

    async callInterface(interfaceName) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`]();
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async receiveTransactionFee(){
      const { instance, web3 } = this.state;
      const response = await instance.receiveTransactionFeeAsync(
        {from: web3.eth.coinbase, gas:20000, value:'addVALUE'}
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
              key={'receiveTransactionFee'}
              onClick={() => this.receiveTransactionFee()}
              >
              {'Receieve Transaction Fee'}
              </button>
            }
          </div>
        );
      }
    }


export default BugEscrow;
