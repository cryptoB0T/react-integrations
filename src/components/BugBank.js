import React, { Component } from 'react'
import $ from 'jquery';

import { promisifyAll } from 'bluebird'
import ABIInterfaceArray from '../util/abis/BugBank.json'

const SMART_CONTRACT_ADDRESS = '0x07bd77fcdbf2000da66550916dd14142b3b41bda'
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

    async calculateOwed(_userAddress){
      const { instance, web3 } = this.state;
      instance.calculateOwed.estimateGas(
        _userAddress,
        {from:web3.eth.coinbase},
        async function(e, gasEstimate){
          if(!e){
            const response = await instance.calculateOwedAsync(
              _userAddress,
              {from: web3.eth.coinbase, gas:gasEstimate}
            );
          }
        });
    }

    render() {
        return (
          <div>
            {/*  TODO;  */}

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
              onClick={() => this.calculateOwed($('#bugBank-_userAddress').val())}
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
