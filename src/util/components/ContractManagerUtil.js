import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../abis/ContractManager.json'

const SMART_CONTRACT_ADDRESS = '0x8e88e493162a6435adfc6809ab713a9cd81e9a1c'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})


export default class ContractManagerUtil  {

    async load(web3) {
        const abi = await web3.eth.contract(ABIInterfaceArray)
        this.instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS));
        this.web3 = web3;
    }

    async setContractManagerAddress(_contractManager){
      this.instance.setContractManager.estimateGas(
        _contractManager,
        {from:this.web3.eth.coinbase},
        async function(e, gasEstimate){
          if(!e){
            const response = await this.instance.setContractManagerAsync(_contractManager,{
              from: this.web3.eth.coinbase, gas:gasEstimate});
          }
        }
      )
    }
  }
