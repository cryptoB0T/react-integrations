import React, { Component } from 'react'
import $ from 'jquery';
import { keccak256 } from 'js-sha3';

import { promisifyAll } from 'bluebird'
import ABIInterfaceArray from '../util/abis/AssetCreation.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x4e5e6b73ffcb08022861dc62f96ba966e72080d7'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )


class Asset extends Component {
    constructor(props) {
      super(props)
      this.state = {
        web3:null,
        database: null,
        instance:null
      }
      this.callConstant = this.callInterface.bind(this);
      this.newAsset = this.newAsset.bind(this);
      this.removeAsset = this.removeAsset.bind(this);
      this.changeFundingTime = this.changeFundingTime.bind(this);
      this.changeFundingPercentages = this.changeFundingPercentages.bind(this);
      this.notZero = this.notZero.bind(this);
      this.getEventInfo = this.getEventInfo.bind(this);
      this.setEventListeners = this.setEventListeners.bind(this);
    }

    async componentDidMount() {
      const { web3, database } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))
      const LogAssetFundingStarted = instance.LogAssetFundingStarted({},{fromBlock: 0, toBlock: 'latest'});
      const LogAssetInfo = instance.LogAssetInfo({},{fromBlock: 0, toBlock: 'latest'});
      const LogAssetRemoved = instance.LogAssetRemoved({},{fromBlock: 0, toBlock: 'latest'});
      const LogFundingTimeChanged = instance.LogAssetRemoved({},{fromBlock: 0, toBlock: 'latest'});
      web3.eth.defaultAccount = web3.eth.coinbase;
      this.setState({ web3: web3, database: database, instance: instance, database: database, LogAssetFundingStarted: LogAssetFundingStarted,
       LogAssetInfo: LogAssetInfo, LogAssetRemoved: LogAssetRemoved, LogFundingTimeChanged: LogFundingTimeChanged});
      this.setEventListeners();
    }

    async callInterface(interfaceName) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`]();
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async setEventListeners(){
      const { instance, web3, LogAssetFundingStarted,
      LogAssetInfo, LogAssetRemoved, LogFundingTimeChanged } = this.state;
      LogAssetFundingStarted.watch(function(e,r){if(!e){alert('LogAssetFundingStarted; ' + r);}});
      LogAssetInfo.watch(function(e,r){if(!e){alert('LogAssetInfo; ' + r);}});
      LogAssetRemoved.watch(function(e,r){if(!e){alert('LogAssetRemoved; ' + r);}});
      LogFundingTimeChanged.watch(function(e,r){if(!e){alert('LogFundingTimeChanged; ' + r);}});
    }

    async newAsset(_storageHash, _amountToBeRaised, _managerPercentage, _installerID, _assetType){
      const { instance, web3} = this.state;
      instance.newAsset.estimateGas(
          _storageHash, _amountToBeRaised, _managerPercentage,
          _installerID, _assetType,
          async function(e,gasEstimate){

            if(!e){
                const response = await instance.newAssetAsync(
                  _storageHash, _amountToBeRaised, _managerPercentage,
                  _installerID, _assetType,
                  {from:web3.eth.coinbase, gas:50000}
                );
            };
          });
        }

    async removeAsset(_assetID, _functionSigner){
      const { instance, web3 } = this.state;
      instance.removeAsset.estimateGas(
        _assetID, _functionSigner,
        {from:web3.eth.coinbase},
        async function(e,gasEstimate){
          if(!e){
            const response = await instance.removeAssetAsync(
              _assetID, _functionSigner,
              {from: web3.eth.coinbase, gas:gasEstimate});
            };
          });
    }

    async changeFundingTime(_newTimeGivenForFunding){
      const { instance, web3 } = this.state;
      if(this.notZero(_newTimeGivenForFunding)){
        instance.changeFundingTime.estimateGas(
          _newTimeGivenForFunding,
          {from:web3.eth.coinbase},
          async function(e,gasEstimate){
          const response = await instance.changeFundingTimeAsync(
            _newTimeGivenForFunding,
            {from: web3.eth.coinbase, gas:gasEstimate}
        );
      });
    }
  }

    async changeFundingPercentages(_myBitFoundationPercentage,
      _stakedTokenPercentage, _installerPercentage, _functionSigner){
      const { instance, web3 } = this.state;
      if(this.notZero(_myBitFoundationPercentage) &&
        this.notZero(_stakedTokenPercentage) &&
        this.notZero(_installerPercentage)){
        instance.changeFundingTime.estimateGas(
          _myBitFoundationPercentage,_stakedTokenPercentage,
          _installerPercentage, _functionSigner,
          {from:web3.eth.coinbase},
           async function(e,gasEstimate){
              const response = await instance.changeFundingPercentagesAsync(
              _myBitFoundationPercentage,_stakedTokenPercentage,
              _installerPercentage, _functionSigner,
              {from: web3.eth.coinbase, gas:gasEstimate}
            );
          });
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

    notZero(_uint){
      return (_uint !== 0);
    }

      render() {



          return (
            <div>
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
                  $('#newAsset-_managerPercentage').val(),
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
            _managerPercentage:<input type="text" id="newAsset-_managerPercentage"></input>
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
          <br /><br /><br /><br />


            </div>
          );
        }
      }


export default Asset;
