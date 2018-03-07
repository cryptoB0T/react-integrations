import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../abis/BugBank.json'


const SMART_CONTRACT_ADDRESS = '0x8e88e493162a6435adfc6809ab713a9cd81e9a1c'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})


export default class BugBankUtil  {

    async load(web3, database) {
        const abi = await web3.eth.contract(ABIInterfaceArray)
        this.instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS));
        this.web3 = web3;
        this.database = database;
    }

    async withdraw(){
      this.instance.withdraw.estimateGas(
        {from:this.web3.eth.coinbase},
        async function(e, gasEstimate){
          if(!e){
            const response = await this.instance.withdrawAsync(
              {from: this.web3.eth.coinbase, gas:gasEstimate}
            );
          }
        });
    }

    async calculateOwed(_userAddress){
      this.instance.calculateOwed.estimateGas(
        _userAddress,
        {from:this.web3.eth.coinbase},
        async function(e, gasEstimate){
          if(!e){
            const response = await this.instance.calculateOwedAsync(
              _userAddress,
              {from: this.web3.eth.coinbase, gas:gasEstimate}
            );
          }
        });
    }
}
