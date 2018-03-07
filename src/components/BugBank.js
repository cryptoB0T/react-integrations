import React, { Component } from 'react'
import $ from 'jquery';

import { promisifyAll } from 'bluebird'
import ABIInterfaceArray from '../util/abis/BugBank.json'

const SMART_CONTRACT_ADDRESS = '0xdf1d5943eb71a694f1db8a8fb2896d2fad8f30ac'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})


class BugBank extends Component {
    constructor(props) {
      super(props)
      this.state = {
        web3:null,
        instance:null,
      }
      this.callConstant = this.callInterface.bind(this);
      this.withdrawal = this.withdrawal.bind(this);
      this.calculateOwedUser = this.calculateOwedUser.bind(this);
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

    async withdrawal(){
      const { instance, web3 } = this.state;
      instance.withdraw.estimateGas(
        {from:web3.eth.coinbase},
        async function(e, gasEstimate){
          if(!e){
            const response = await instance.withdrawAsync(
              {from: web3.eth.coinbase, gas:gasEstimate}
            );
          }
        });
    }

    async calculateOwedUser(_userAddress){
      /*
    console.log('Testing', _userAddress);
      const { instance, web3 } = this.state;
      instance.calculateOwed.estimateGas(
        _userAddress,
        {from:web3.eth.coinbase},
        async function(e, gasEstimate){
          console.log(e);
          if(!e){
            alert(gasEstimate);
            const response = await instance.calculateOwedAsync(
              _userAddress,
              {from: web3.eth.coinbase, gas:gasEstimate}
            );
          }
        });*/
    }

    render() {
        return (
          <div>
            {/*  TODO;  */}

            {
              <button
              style={{ margin: 'auto', display: 'block' }}
              key={'withdraw'}
              onClick={() => this.withdrawal()}
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
              onClick={() => this.calculateOwedUser($('#bugBank-_userAddress').val())}
              >
              {'Calculate Owed'}
              </button>
            }
            _userAddress:<input type="text" id="bugBank-_userAddress"></input>

            <br /><br /><br /><br />


          </div>
        );
      }
    }


export default BugBank;
