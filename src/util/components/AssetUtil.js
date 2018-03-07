import { promisifyAll } from 'bluebird'
import { keccak256 } from 'js-sha3';

import ABIInterfaceArray from '../abis/Asset.json'


const SMART_CONTRACT_ADDRESS = '0x327b9bf53be269c48fb9b59bd73a71f20c829373'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})


export default class AssetUtil  {

    async load(web3, database) {
        const abi = await web3.eth.contract(ABIInterfaceArray)
        this.instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS));
        this.web3 = web3;
        this.database = database;
    }

    async withdrawal(_assetID, _otherWithdrawal) {
      const addrSet = await this.database.addressStorage(keccak256("withdrawalAddress", this.web3.eth.coinbase));
      if(addrSet !== 'ff' &&
         addrSet !== 'ffs'
       ){
         this.instance.withdraw.estimateGas(
           _assetID, _otherWithdrawal,
           {from:this.web3.eth.coinbase},
           async function(e, gasEstimate){
             if(!e){
               console.log(gasEstimate);
               const response = await this.instance.withdrawAsync(
                 _assetID, _otherWithdrawal,
                 {from:this.web3.eth.coinbase, gas:gasEstimate});
                 alert(response);

             }
         });
       }
    }

    async receiveIncome(_assetID, _note) {
      this.instance.receiveIncome.estimateGas(
        _assetID, _note,
        {from:this.web3.eth.coinbase},
        async function(e, gasEstimate){
          if(!e){
            console.log(gasEstimate);
            const response = await this.instance.receiveIncomeAsync(
              _assetID, _note,
              {from: this.web3.eth.coinbase, gas: gasEstimate});
          }
        });
    }
}
