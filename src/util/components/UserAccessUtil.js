import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../abis/UserAccess.json'

const SMART_CONTRACT_ADDRESS = '0x8e88e493162a6435adfc6809ab713a9cd81e9a1c'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})

export default class UserAccessUtil  {
    async load(web3, modifier) {
        const abi = await web3.eth.contract(ABIInterfaceArray)
        this.instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS));
        this.web3 = web3;
        this.modifier = modifier;
    }

    async setBackupAddress(_backupAddress){
      if(this.modifier.accessLevel() > 0){
        this.instance.setBackupAddress.estimateGas(
            _backupAddress,
            {from:this.web3.eth.coinbase},
            async function(e, gasEstimate){
              if(!e){
                const response = await this.instance.setBackupAddressAsync(_backupAddress,{
                  from: this.web3.eth.coinbase, gas:gasEstimate});
              }
            }
          )
        }
      }

    async switchToBackup(_oldAddress, _newBackup){
      if(this.modifier.accessLevel() > 0){
         this.instance.switchToBackup.estimateGas(
            _oldAddress, _newBackup,
            {from:this.web3.eth.coinbase},
            async function(e, gasEstimate){
              if(!e){
                const response = await this.instance.switchToBackupAsync(_oldAddress, _newBackup,{
                  from: this.web3.eth.coinbase, gas:gasEstimate});
            }
          }
        )
      }
    }
  }
