import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../abis/AssetCreation.json'


const SMART_CONTRACT_ADDRESS = '0x8e88e493162a6435adfc6809ab713a9cd81e9a1c'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})


export default class AssetCreationUtil  {

    async load(web3, database) {
        const abi = await web3.eth.contract(ABIInterfaceArray)
        this.instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS));
        this.web3 = web3;
        this.database = database;
    }

    async newAsset(_storageHash, _amountToBeRaised, _installerID, _assetType) {
      this.instance.newAsset.estimateGas(
        _storageHash, _amountToBeRaised,
        _installerID, _assetType,
        {from:this.web3.eth.coinbase},
        async function(e,gasEstimate){
          if(!e){
              const response = await this.instance.newAssetAsync(
                _storageHash, _amountToBeRaised,
                _installerID, _assetType,
                {from:this.web3.eth.coinbase, gas:gasEstimate}
              );
          };
        });
    }

    async removeAsset(_assetID, _functionSigner) {
      this.instance.removeAsset.estimateGas(
        _assetID, _functionSigner,
        {from:this.web3.eth.coinbase},
        async function(e,gasEstimate){
          if(!e){
            const response = await this.instance.removeAssetAsync(
              _assetID, _functionSigner,
              {from: this.web3.eth.coinbase, gas:gasEstimate});
            };
          });
        }

    async changeFundingTime(_newTimeGivenForFunding){
      if(_newTimeGivenForFunding !== 0){
        this.instance.changeFundingTime.estimateGas(
          _newTimeGivenForFunding,
          {from:this.web3.eth.coinbase},
          async function(e,gasEstimate){
          const response = await this.instance.changeFundingTimeAsync(
            _newTimeGivenForFunding,
            {from: this.web3.eth.coinbase, gas:gasEstimate}
        );
      });
    }
  }

  async changeFundingPercentages(_myBitFoundationPercentage,
    _stakedTokenPercentage, _installerPercentage, _functionSigner){
    const { instance, web3 } = this.state;
    if(_myBitFoundationPercentage !==0 &&
      _stakedTokenPercentage !== 0     &&
      _installerPercentage !== 0 ){
      this.instance.changeFundingTime.estimateGas(
        _myBitFoundationPercentage,_stakedTokenPercentage,
        _installerPercentage, _functionSigner,
        {from:this.web3.eth.coinbase},
         async function(e,gasEstimate){
            const response = await this.instance.changeFundingPercentagesAsync(
            _myBitFoundationPercentage,_stakedTokenPercentage,
            _installerPercentage, _functionSigner,
            {from: this.web3.eth.coinbase, gas:gasEstimate}
          );
        });
    }
  }
}
