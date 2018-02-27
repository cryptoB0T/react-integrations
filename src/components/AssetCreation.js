import React, { Component } from 'react'
import $ from 'jquery';

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

            {/* TODO;
                       Grab _storageHash from bigchainDB
                       Grab _installerID from bigchainDB
                       Grab _amountToBeRaised from bigchainDB
                       Grab _assetType from bigchainDB
                For example text boxes have been created
              */}
              <br />
              {
                <button
                key={'newAsset'}
                onClick={() => this.newAsset(
                  $('#newAsset-_storageHash').val(),
                  $('#newAsset-_amountToBeRaised').val(),
                  $('#newAsset-_installerID').val(),
                  $('#newAsset-_assetType').val()
                )}
                >
                {'New Asset'}
                </button>
              }
              <br />
            _storageHash:<input type="text" id="newAsset-_storageHash"></input>
            _amountToBeRaised:<input type="text" id="newAsset-_amountToBeRaised"></input>
            _installerID:<input type="text" id="newAsset-_installerID"></input>
            _assetType:<input type="text" id="newAsset-_assetType"></input>

          <br />

            {/* TODO;
                       Grab _assetID from bigchainDB
                For example text boxes have been created
              */}
              <br />
              {
                <button
                style={{ margin: 'auto', display: 'block' }}
                key={'removeAsset'}
                onClick={() => this.removeAsset(
                  $('#removeAsset-_assetID').val(),
                  $('#removeAsset-_functionSigner').val(),
                )}
                >
                {'Remove Asset'}
                </button>
              }
              _assetID:<input type="text" id="removeAsset-_assetID"></input>
              _functionSigner:<input type="text" id="removeAsset-_functionSigner"></input>
              <br />


              <br />
              {
                <button
                style={{ margin: 'auto', display: 'block' }}
                key={'changeFundingTime'}
                onClick={() => this.changeFundingTime(
                    $('#changeFundingTime-_newTimeGivenForFunding').val())}
                >
                {'Change Funding Time'}
                </button>
            }
            _newTimeGivenForFunding:<input type="text" id="changeFundingTime-_newTimeGivenForFunding"></input>


              <br />
              <br />
             {
              <button
              style={{ margin: 'auto', display: 'block' }}
              key={'changeFundingPercentages'}
              onClick={() => this.changeFundingPercentages(
                  $('#changeFundingPercentages-_myBitFoundationPercentage').val(),
                  $('#changeFundingPercentages-_stakedTokenPercentage').val(),
                  $('#changeFundingPercentages-_installerPercentage').val(),
                  $('#changeFundingPercentages-_functionSigner').val()
                )}
              >
              {'Change Funding Percentages'}
              </button>
          }
          _myBitFoundationPercentage:<input type="text" id="changeFundingPercentages-_myBitFoundationPercentage"></input>
          _stakedTokenPercentage:<input type="text" id="changeFundingPercentages-_stakedTokenPercentage"></input>
          _installerPercentage:<input type="text" id="changeFundingPercentages-_installerPercentage"></input>
          _functionSigner:<input type="text" id="changeFundingPercentages-_functionSigner"></input>


            </div>
          );
        }
      }


export default Asset;
