import React, { Component } from 'react'

import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/HashFunctions.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x0'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )
const methodsFromInterface = ABIInterfaceArray.filter( ABIinterface => !ABIinterface.constant )


class HashFunctions extends Component {
    constructor(props) {
      super(props)
      this.state = {
        instance:null,
      }
      this.getOrderID = this.getOrderID.bind(this);
      this.getStakingID = this.getStakingID.bind(this);
      this.sha3 = this.sha3.bind(this);
      this.addressHash = this.addressHash.bind(this);
      this.contractHash = this.contractHash.bind(this);
      this.stringAddress = this.stringAddress.bind(this);
      this.stringBytes = this.stringBytes.bind(this);
      this.stringBytesAddress = this.stringBytesAddress.bind(this);
      this.getAuthorizeHash = this.getAuthorizeHash.bind(this);
    }

    async componentDidMount() {
      const { web3 } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))
      this.setState({ web3: web3, instance: instance })
    }

    async getOrderID(_user, _assetID){
      const { instance, web3 } = this.state;
      const response = await instance.getOrderID(_user, _assetID);
    }

    async getStakingID(_staker, _blockNumber, _amount){
      const { instance, web3 } = this.state;
      const response = await instance.payout(_staker, _blockNumber);
      }

    async sha3(_name){
      const { instance, web3 } = this.state;
      const response = await instance.sha3(_name);
      }

    async addressHash(_address){
      const { instance, web3 } = this.state;
      const response = await instance.addressHash(_address);
      }

    async contractHash(_name){
      const { instance, web3 } = this.state;
      const response = await instance.contractHash(_name);
      }

    async stringAddress(_param, _paramTwo){
      const { instance, web3 } = this.state;
      const response = await instance.stringAddress(_param, _paramTwo);
      }

    async stringBytes(_param, _paramTwo){
      const { instance, web3 } = this.state;
      const response = await instance.stringBytes(_param, _paramTwo);
      }

    async stringUint(_param, _paramTwo){
      const { instance, web3 } = this.state;
      const response = await instance.stringUint(_param, _paramTwo);
      }

    async stringBytesAddress(_param, _paramTwo, _paramThree){
      const { instance, web3 } = this.state;
      const response = await instance.stringUint(_param, _paramTwo, _paramThree);
      }

    async getAuthorizeHash(_contractAddress, _owner,  _fnName, _recipient){
      const { instance, web3 } = this.state;
      const response = await instance.stringUint(_contractAddress, _owner,  _fnName, _recipient);
      }

    render() {
        return (
          <div>

            {/*  TODO; */}
            <br />
            {
              <button
              style={{ margin: 'auto', display: 'block' }}
              key={'getOrderID'}
              onClick={() => this.getOrderID('_user', '_assetID')}
              >
              {'Get Order ID'}
              </button>
          }

          {/*  TODO; */}
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'getStakingID'}
            onClick={() => this.getStakingID('_staker', '_blockNumber', '_amount')}
            >
            {'Get Staking ID'}
            </button>
          }

          {/*  TODO;  */}
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'sha3'}
            onClick={() => this.sha3('_name')}
            >
            {'Sha3'}
            </button>
          }

          {/*  TODO;  */}
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'addressHash'}
            onClick={() => this.addressHash('_address')}
            >
            {'Address Hash'}
            </button>
          }

          {/*  TODO;  */}
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'contractHash'}
            onClick={() => this.contractHash('_name')}
            >
            {'Contract Hash'}
            </button>
          }

          {/*  TODO;  */}
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'stringAddress'}
            onClick={() => this.stringAddress('_param', '_paramTwo')}
            >
            {'String Address'}
            </button>
          }

          {/*  TODO;  */}
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'stringBytes'}
            onClick={() => this.stringBytes('_param', '_paramTwo')}
            >
            {'String Bytes'}
            </button>
          }

          {/*  TODO;  */}
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'stringUint'}
            onClick={() => this.stringUint('_param', '_paramTwo')}
            >
            {'String Uint'}
            </button>
          }

          {/*  TODO;  */}
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'stringBytesAddress'}
            onClick={() => this.stringBytesAddress('_param', '_paramTwo', '_paramThree')}
            >
            {'String Bytes Address'}
            </button>
          }

          {/*  TODO;  */}
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'getAuthorizeHash'}
            onClick={() => this.getAuthorizeHash('_param', '_paramTwo', '_paramThree')}
            >
            {'String Bytes Address'}
            </button>
          }

          <br /><br /><br /><br />




          </div>
        );
      }
}

export default HashFunctions;
