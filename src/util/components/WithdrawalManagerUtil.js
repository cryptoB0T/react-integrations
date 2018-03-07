import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../abis/WithdrawalManager.json'

const SMART_CONTRACT_ADDRESS = '0x8e88e493162a6435adfc6809ab713a9cd81e9a1c'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})

export default class WithdrawalManagerUtil  {
    async load(web3, modifier) {
        const abi = await web3.eth.contract(ABIInterfaceArray)
        this.instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS));
        this.web3 = web3;
        this.modifier = modifier;
    }

    async addWithdrawalAddress(_withdrawalAddress){
      if(!this.modifier.withdrawalAddressSet()){
        this.instance.addWithdrawalAddress.estimateGas(
            _withdrawalAddress,
            {from:this.web3.eth.coinbase},
            async function(e, gasEstimate){
              if(!e){
              const response = await this.instance.addWithdrawalAddressAsync(_withdrawalAddress,{
                from: this.web3.eth.coinbase, gas:gasEstimate});
            }
          }
        )
      }
    }

    async removeWithdrawalAddress(){
      if(this.modifier.withdrawalAddressSet()){
        this.instance.removeWithdrawalAddress.estimateGas(
            {from:this.web3.eth.coinbase},
            async function(e, gasEstimate){
              if(!e){
              const response = await this.instance.removeWithdrawalAddressAsync({
                from: this.web3.eth.coinbase, gas:gasEstimate});
              }
            }
          )
        }
      }

    async updateWithdrawalAddress(_withdrawalAddress){
      if(this.modifier.withdrawalAddressSet()){
        this.instance.updateWithdrawalAddress.estimateGas(
            _withdrawalAddress,
            {from:this.web3.eth.coinbase},
            async function(e, gasEstimate){
              if(!e){
                const response = await this.instance.updateWithdrawalAddressAsync(_withdrawalAddress,{
                  from: this.web3.eth.coinbase, gas:gasEstimate});
                }
              }
            )
          }
        }
  }
