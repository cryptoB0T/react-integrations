import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../abis/BugBounty.json'

const SMART_CONTRACT_ADDRESS = '0x8e88e493162a6435adfc6809ab713a9cd81e9a1c'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})


export default class BugBountyUtil  {

    async load(web3, database) {
        const abi = await web3.eth.contract(ABIInterfaceArray)
        this.instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS));
        this.web3 = web3;
        this.database = database;
    }

    async submitBug(_severity){
      if(_severity > 0 && _severity < 4){
        this.instance.submitBug.estimateGas(
          _severity,
          {from:this.web3.eth.coinbase},
          async function(e, gasEstimate){
            if(!e){
              const response = await this.instance.submitBugAsync(
                _severity,
                {from: this.web3.eth.coinbase, gas:gasEstimate}
              );
            }
          })
        }
    }

    /* TODO; grab bug ID*/
    async voteForBug(_bugID, _upvote){
      this.instance.voteForBug.estimateGas(
        _bugID, _upvote,
        {from:this.web3.eth.coinbase},
        async function(e, gasEstimate){
          if(!e){
              const response = await this.instance.voteForBugAsync(
                _bugID, _upvote,
                {from: this.web3.eth.coinbase, gas:gasEstimate}
              );
            }
        }
      )
    }
  }
