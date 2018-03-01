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
        LogBackupAddressUsed: null,
        LogUserApproved: null,
        LogUserRemoved: null,
      }
      this.callInterface = this.callInterface.bind(this);
      this.setBackupAddress = this.setBackupAddress.bind(this);
      this.switchToBackup = this.switchToBackup.bind(this);
      this.getEventInfo = this.getEventInfo.bind(this);
    }

    async componentDidMount() {
      const { web3, modifier } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))
      const LogBackupAddressUsed = instance.LogBackupAddressUsed({},{fromBlock: 0, toBlock: 'latest'});
      const LogUserApproved = instance.LogUserApproved({},{fromBlock: 0, toBlock: 'latest'});
      const LogUserRemoved = instance.LogUserRemoved({},{fromBlock: 0, toBlock: 'latest'});
      this.setState({ web3: web3, instance: instance, modifier: modifier, LogBackupAddressUsed: LogBackupAddressUsed,
      LogUserApproved: LogUserApproved, LogUserRemoved })
    }

    async callInterface(interfaceName, _param){
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`](_param);
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async setBackupAddress(_backupAddress){
      const { instance, web3, modifier} = this.state;
      if(modifier.accessLevel() > 0){
        const response = await instance.setBackupAddress(_backupAddress,{
          from: web3.eth.coinbase, gas:20000});
      }
    }

    async switchToBackup(_oldAddress, _newBackup){
      const { instance, web3, modifier } = this.state;
      if(modifier.accessLevel() > 0){
        const response = await instance.switchToBackup(_oldAddress, _newBackup,{
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
      this.LogBackupAddressUsed.watch(function(e,r){
        if(!e){
          var eventInfo = this.getEventInfo(r);
          var _oldAddress = r._oldAddress;
          var _newAddress = r._newAddress;
          var _timestamp = r._timestamp;
        }
      });

      { /*Store these in bigchainDB*/}
      this.LogUserApproved.watch(function(e,r){
        if(!e){
          var eventInfo = this.getEventInfo(r);
          var _user = r._user;
          var _approvalLevel = r._approvalLevel;
          var _timestamp = r._timestamp;
          }
      });

      { /*Store these in bigchainDB*/}
      this.LogUserRemoved.watch(function(e,r){
        if(!e){
          var eventInfo = this.getEventInfo(r);
          var _user = r._user;
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
              key={'setBackupAddress'}
              onClick={() => this.setBackupAddress('_oldAddress', '_newBackup')}
              >
              {'Set Backup Address'}
              </button>
          }


          </div>
        );
      }
}

export default UserAccess;
