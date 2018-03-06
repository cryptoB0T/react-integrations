import React, { Component } from 'react'
import $ from 'jquery';

import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/UserAccess.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0xebc9907d2d0547d80eec85bcfde0edce020400eb'
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
      this.setState({ web3: web3, instance: instance, modifier: modifier})
    }

    async callInterface(interfaceName, _param){
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`](_param);
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async setBackupAddress(_backupAddress){
      const { instance, web3, modifier} = this.state;
      if(modifier.accessLevel() > 0){
        instance.setBackupAddress.estimateGas(
            _backupAddress,
            {from:web3.eth.coinbase},
            async function(e, gasEstimate){
              if(!e){
                const response = await instance.setBackupAddressAsync(_backupAddress,{
                  from: web3.eth.coinbase, gas:gasEstimate});
              }
            }
          )
        }
      }

    async switchToBackup(_oldAddress, _newBackup){
      const { instance, web3, modifier } = this.state;
      if(modifier.accessLevel() > 0){
        instance.switchToBackup.estimateGas(
            _oldAddress, _newBackup,
            {from:web3.eth.coinbase},
            async function(e, gasEstimate){
              if(!e){
                const response = await instance.switchToBackupAsync(_oldAddress, _newBackup,{
                  from: web3.eth.coinbase, gas:gasEstimate});
              }
            }
          )
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

        return (
          <div>
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
            <br />  <br />
            {
              <button
              style={{ margin: 'auto', display: 'block' }}
              key={'setBackupAddress'}
              onClick={() => this.setBackupAddress(
                $('#useraccess-_set-backupAddress').val()
              )}
              >
              {'Set Backup Address'}
              </button>
          }
          _backupAddress:<input type="text" id="useraccess-_set-backupAddress"></input>



          <br />  <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'switchToBackup'}
            onClick={() => this.switchToBackup(
              $('#useraccess-switch-_oldAddress').val(),
              $('#useraccess-switch-_newBackup').val()
            )}
            >
            {'Switch To Backup Address'}
            </button>
        }
        _oldAddress:<input type="text" id="useraccess-switch-_oldAddress"></input>
        _newBackup:<input type="text" id="useraccess-switch-_newBackup"></input>

          <br /><br /><br /><br />
          </div>
        );
      }
}

export default UserAccess;
