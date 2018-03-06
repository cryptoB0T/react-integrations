import React, { Component } from 'react'
import $ from 'jquery';

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
      this.setState({ web3: web3, instance: instance, modifier: modifier})
    }

    async callInterface(interfaceName, _param){
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`](_param);
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async addWithdrawalAddress(_withdrawalAddress){
      const { instance, web3, modifier } = this.state;
      if(!modifier.withdrawalAddressSet()){
        instance.addWithdrawalAddress.estimateGas(
            _withdrawalAddress,
            {from:web3.eth.coinbase},
            async function(e, gasEstimate){
              if(!e){
              const response = await instance.addWithdrawalAddressAsync(_withdrawalAddress,{
                from: web3.eth.coinbase, gas:gasEstimate});
            }
          }
        )
      }
    }

    async removeWithdrawalAddress(){
      const { instance, web3, modifier } = this.state;
      if(modifier.withdrawalAddressSet()){
        instance.removeWithdrawalAddress.estimateGas(
            {from:web3.eth.coinbase},
            async function(e, gasEstimate){
              if(!e){
              const response = await instance.removeWithdrawalAddressAsync({
                from: web3.eth.coinbase, gas:gasEstimate});
              }
            }
          )
        }
      }

    async updateWithdrawalAddress(_withdrawalAddress){
      const { instance, web3, modifier } = this.state;
      if(modifier.withdrawalAddressSet()){
        instance.updateWithdrawalAddress.estimateGas(
            _withdrawalAddress,
            {from:web3.eth.coinbase},
            async function(e, gasEstimate){
              if(!e){
                const response = await instance.updateWithdrawalAddressAsync(_withdrawalAddress,{
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
            <br />
            {
              <button
              style={{ margin: 'auto', display: 'block' }}
              key={'addWithdrawalAddress'}
              onClick={() => this.addWithdrawalAddress(
                  $('#withdrawalmanager-_withdrawalAddress').val()
              )}
              >
              {'Add Withdrawal Address'}
              </button>
          }
          _withdrawalAddress:<input type="text" id="withdrawalmanager-_withdrawalAddress"></input>


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
            onClick={() => this.updateWithdrawalAddress(
              $('#withdrawalmanager-update_withdrawaladdress').val()
            )}
            >
            {'Update Withdrawal Address'}
            </button>
          }
          _withdrawalAddress:<input type="text" id="withdrawalmanager-update_withdrawaladdress"></input>

          <br /><br /><br /><br />

          </div>
        );
      }
}

export default UserAccess;
