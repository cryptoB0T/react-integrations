import React, { Component } from 'react'

import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/UserAccess.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x0'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )


class UserAccess extends Component {
    constructor(props) {
      super(props)
      this.state = {
        web3:null,
        instance:null,
        modifier:null,
        LogWithdrawalAddressSet:null,
        LogWithdrawalAddressRemoved:null,
        LogWithdrawalAddressUpdated:null,
      }
      this.callInterface = this.callInterface.bind(this);
      this.addWithdrawalAddress = this.addWithdrawalAddress.bind(this);
      this.removeWithdrawalAddress = this.removeWithdrawalAddress.bind(this);
      this.updateWithdrawalAddress = this.updateWithdrawalAddress.bind(this);
      this.getEventInfo = this.getEventInfo.bind(this);
    }

    async componentDidMount() {
      const { web3, modifier } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))
      const LogWithdrawalAddressSet = instance.LogWithdrawalAddressSet({},{fromBlock: 0, toBlock: 'latest'});
      const LogWithdrawalAddressRemoved = instance.LogWithdrawalAddressRemoved({},{fromBlock: 0, toBlock: 'latest'});
      const LogWithdrawalAddressUpdated = instance.LogWithdrawalAddressUpdated({},{fromBlock: 0, toBlock: 'latest'});
      this.setState({ web3: web3, instance: instance, modifier: modifier, LogWithdrawalAddressSet : LogWithdrawalAddressSet,
       LogWithdrawalAddressRemoved : LogWithdrawalAddressRemoved, LogWithdrawalAddressUpdated : LogWithdrawalAddressUpdated })
    }

    async callInterface(interfaceName, _param){
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`](_param);
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async addWithdrawalAddress(_withdrawalAddress){
      const { instance, web3, modifier } = this.state;
      if(!modifier.withdrawalAddressSet()){
        const response = await instance.addWithdrawalAddress(_withdrawalAddress,{
          from: web3.eth.coinbase, gas:20000});
      }
    }

    async removeWithdrawalAddress(){
      const { instance, web3, modifier } = this.state;
      if(modifier.withdrawalAddressSet()){
        const response = await instance.removeWithdrawalAddress({
          from: web3.eth.coinbase, gas:20000});
        }
      }

    async updateWithdrawalAddress(_withdrawalAddress){
      const { instance, web3, modifier } = this.state;
      if(modifier.withdrawalAddressSet()){
        const response = await instance.updateWithdrawalAddress(_withdrawalAddress,{
          from: web3.eth.coinbase, gas:20000});
        }
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

    render() {

      { /*Store these in bigchainDB*/}
      this.LogWithdrawalAddressSet.watch(function(e,r){
        if(!e){
          var eventInfo = this.getEventInfo(r);
          var _user = r._user;
          var _newAddress = r._newAddress;
          var _timestamp = r._timestamp;
        }
      });

      { /*Store these in bigchainDB*/}
      this.LogWithdrawalAddressRemoved.watch(function(e,r){
        if(!e){
          var eventInfo = this.getEventInfo(r);
          var _user = r._user;
          var _removedAddress = r._removedAddress;
          var _timestamp = r._timestamp;
          }
      });

      { /*Store these in bigchainDB*/}
      this.LogWithdrawalAddressUpdated.watch(function(e,r){
        if(!e){
          var eventInfo = this.getEventInfo(r);
          var _user = r._user;
          var _oldAddress = r._oldAddress;
          var _updatedAddress = r._updatedAddress;
          var _timestamp = r._timestamp;
          }
      });

        return (
          <div>
            <br /><br />
            {
              constantsFromInterface.map( constant => (
              <button
                style={{ margin: 'auto', display: 'block' }}
                key={constant.name}
                onClick={() => this.callInterface(constant.name, '_param')}
                >
                {constant.name}
              </button>
            ))}

            {/*  TODO; */}
            <br />
            {
              <button
              style={{ margin: 'auto', display: 'block' }}
              key={'addWithdrawalAddress'}
              onClick={() => this.addWithdrawalAddress('_withdrawalAddress')}
              >
              {'Add Withdrawal Address'}
              </button>
          }

          {/*  TODO; */}
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'removeWithdrawalAddress'}
            onClick={() => this.removeWithdrawalAddress()}
            >
            {'Remove Withdrawal Address'}
            </button>
          }

          {/*  TODO;  */}
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'updateWithdrawalAddress'}
            onClick={() => this.updateWithdrawalAddress('_withdrawalAddress')}
            >
            {'Update Withdrawal Address'}
            </button>
          }

          </div>
        );
      }
}

export default UserAccess;
