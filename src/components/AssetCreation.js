import React, { Component } from 'react'
import { promisifyAll } from 'bluebird'
import ABIInterfaceArray from '../util/abis/AssetCreation.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x0'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )


class Asset extends Component {
    constructor(props) {
      super(props)
      this.state = {
        instance:null,
        LogAssetFundingStarted:null,
        LogAssetInfo:null,
        LogAssetRemoved:null,
        LogFundingTimeChanged:null,
      }
      this.callConstant = this.callInterface.bind(this);
      this.newAsset = this.newAsset.bind(this);
      this.removeAsset = this.removeAsset.bind(this);
      this.changeFundingTime = this.changeFundingTime.bind(this);
      this.changeFundingPercentages = this.changeFundingPercentages.bind(this);
    }

    async componentDidMount() {
      const { web3 } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))
      const LogAssetFundingStarted = instance.LogAssetFundingStarted({},{fromBlock: 0, toBlock: 'latest'});
      const LogAssetInfo = instance.LogAssetInfo({},{fromBlock: 0, toBlock: 'latest'});
      const LogAssetRemoved = instance.LogAssetRemoved({},{fromBlock: 0, toBlock: 'latest'});
      const LogFundingTimeChanged = instance.LogAssetRemoved({},{fromBlock: 0, toBlock: 'latest'});
      this.setState({ web3: web3, instance: instance, LogAssetFundingStarted: LogAssetFundingStarted,
       LogAssetInfo: LogAssetInfo, LogAssetRemoved: LogAssetRemoved, LogFundingTimeChanged: LogFundingTimeChanged})
    }

    async callInterface(interfaceName) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`]();
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async newAsset(_storageHash, _amountToBeRaised, _installerID, _assetType){
      const { instance, web3 } = this.state;
      const response = await instance.newAssetAsync(
        _storageHash, _amountToBeRaised, _installerID, _assetType,
        {from: web3.eth.coinbase, gas:20000}
      );
    }

    async removeAsset(_assetID, _functionSigner){
      const { instance, web3 } = this.state;
      const response = await instance.removeAssetAsync(
        _assetID, _functionSigner,
        {from: web3.eth.coinbase, gas:20000}
      );
    }

    async changeFundingTime(_newTimeGivenForFunding){
      const { instance, web3 } = this.state;
      const response = await instance.changeFundingTimeAsync(
        _newTimeGivenForFunding,
        {from: web3.eth.coinbase, gas:20000}
      );
    }

    async changeFundingPercentages(_myBitFoundationPercentage,
      _stakedTokenPercentage, _installerPercentage, _functionSigner){
      const { instance, web3 } = this.state;
      const response = await instance.changeFundingPercentagesAsync(
        _myBitFoundationPercentage,_stakedTokenPercentage,
        _installerPercentage, _functionSigner,
        {from: web3.eth.coinbase, gas:20000}
      );
    }

      render() {
          return (
            <div>
              <br /><br />
              {
                constantsFromInterface.map( constant => (
                <button
                  style={{ margin: 'auto', display: 'block' }}
                  key={constant.name}
                  onClick={() => this.callInterface(constant.name)}
                  >
                  {'Constant : ' + constant.name}
                </button>
              ))}

              {/* New Asset TODO; Grab data from BigchainDB */}
              <br />
              {
                <button
                style={{ margin: 'auto', display: 'block' }}
                key={'newAsset'}
                onClick={() => this.newAsset(
                  '_storageHash', '_amountToBeRaised',
                  '_installerID', '_assetType')}
                >
                {'New Asset'}
                </button>
              }

              {/* Remove Asset TODO; Grab _assetID from bigchainDB */}
              <br />
              {
                <button
                style={{ margin: 'auto', display: 'block' }}
                key={'removeAsset'}
                onClick={() => this.removeAsset(
                  '_assetID', '0x0')}
                >
                {'Remove Asset'}
                </button>
              }

              {/* Change Funding Time TODO; Grab funding time from text field */}
              <br />
              {
                <button
                style={{ margin: 'auto', display: 'block' }}
                key={'changeFundingTime'}
                onClick={() => this.changeFundingTime(
                  '_newTimeGivenForFunding')}
                >
                {'Change Funding Time'}
                </button>
            }

            {/* Change Funding Percentage TODO; Grab % from fields */}
              <br />
             {
              <button
              style={{ margin: 'auto', display: 'block' }}
              key={'changeFundingPercentages'}
              onClick={() => this.changeFundingPercentages(
                '_myBitFoundationPercentage', '_stakedTokenPercentage',
                '_installerPercentage', '_functionSigner')}
              >
              {'Change Funding Percentages'}
              </button>
          }

            </div>
          );
        }
      }


export default Asset;
