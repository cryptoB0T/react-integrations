import React, { Component } from 'react'
import $ from 'jquery';
import { keccak256 } from 'js-sha3';

import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/HelloTestnet.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0xa0bb3caeeee9ce72413f943ac731c5514ce57b28'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )
const methodsFromInterface = ABIInterfaceArray.filter( ABIinterface => !ABIinterface.constant )


class Asset extends Component {
    constructor(props) {
      super(props)
      this.state = {
        web3:null,
        database:null,
        instance:null
      }
      this.callConstant = this.callInterface.bind(this);
      this.setEventListeners = this.setEventListeners.bind(this);
      this.ChangeFundingTime = this.ChangeFundingTime.bind(this);
      this.getEventInfo = this.getEventInfo.bind(this);
    }

    async componentDidMount() {
      const { web3, database } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray);
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS));
      web3.eth.defaultAccount = web3.eth.coinbase;
      const LogHelloChanged = instance.LogHelloChanged({}, {fromBlock:0, toBlock:'latest'});




      this.setState({ web3: web3, database: database, instance: instance, LogHelloChanged: LogHelloChanged });
      this.setEventListeners();
    }


    async callInterface(interfaceName) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`]();
      alert(`The result from calling ${interfaceName} is ${response}`);
    }


    async ChangeFundingTime(_newValue2){
      const { instance, web3, database } = this.state;
      const response = await instance.changeFundingTimeAsync(
        _newValue2,
        {from:web3.eth.coinbase, gas:6385876});

     }


     async getEventInfo(_object){
       var dictReturn = {
                         _contractAddr: _object.address,
                         _blockHash: _object.blockHash,
                         _blockNumber: _object.blockNumer,
                         _event: _object.event,
                         _logIndex: _object.logIndex,
                         _transactionHash: _object.transactionHash,
                         _transactionIndex: _object._transactionIndex};
       return dictReturn;
     }

     async setEventListeners(){
       const { instance, web3, LogHelloChanged} = this.state;
       LogHelloChanged.watch(function(e,r){if(!e){
         console.log(r.address, r.blockHash, r.blockNumber, r.event,
         r.logIndex, r.transactionHash, r.transactionIndex);
       }});
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

            {/*TODO; Grab _assetID from bigchainDB */ }
            <br />
            {
              <button
              key={'withdrawal'}
              onClick={() => this.ChangeFundingTime(
                $('#HelloTestnet-_newValue2').val()
              )}
              >
              {'Withdrawal:'}
              </button>
          }
          _newValue2:<input type="text" id="HelloTestnet-_newValue2"></input>

          <br />




        <br />
          <br /><br />


          </div>
        );
      }
}

export default Asset;
