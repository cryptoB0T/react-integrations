import React, { Component } from 'react'
import $ from 'jquery';

import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/FundingHub.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x0'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )
const methodsFromInterface = ABIInterfaceArray.filter( ABIinterface => !ABIinterface.constant )


class FundingHub extends Component {
    constructor(props) {
      super(props)
      this.state = {
        instance:null,
        LogNewFunder:null,
        LogAssetFunded:null,
        LogAssetFundingFailed:null,
        LogAssetPayoutInstaller:null,
        LogRefund:null,
        LogFundingTimeChanged:null,
        LogAssetEscrowChanged:null,
        LogAssetPayoutMyBitFoundation:null,
        LogAssetPayoutLockedTokenHolders:null,
        LogDestruction:null,
      }
      this.callConstant = this.callInterface.bind(this);
      this.fund = this.fund.bind(this);
      this.payout = this.payout.bind(this);
      this.initiateRefund = this.initiateRefund.bind(this);
      this.refund = this.refund.bind(this);
    }

    async componentDidMount() {
      const { web3 } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))
      const LogNewFunder = instance.LogNewFunder({},{fromBlock: 0, toBlock: 'latest'});
      const LogAssetFunded = instance.LogAssetFunded({},{fromBlock: 0, toBlock: 'latest'});
      const LogAssetFundingFailed = instance.LogAssetFundingFailed({},{fromBlock: 0, toBlock: 'latest'});
      const LogAssetPayoutInstaller = instance.LogAssetPayoutInstaller({}, {fromBlock: 0, toBlock: 'latest'});
      const LogRefund = instance.LogRefund({}, {fromBlock: 0, toBlock: 'latest'});
      const LogFundingTimeChanged = instance.LogFundingTimeChanged({}, {fromBlock: 0, toBlock: 'latest'});
      const LogAssetEscrowChanged = instance.LogAssetEscrowChanged({}, {fromBlock: 0, toBlock: 'latest'});
      const LogAssetPayoutMyBitFoundation = instance.LogAssetPayoutMyBitFoundation({}, {fromBlock: 0, toBlock: 'latest'});
      const LogAssetPayoutLockedTokenHolders = instance.LogAssetPayoutLockedTokenHolders({}, {fromBlock: 0, toBlock: 'latest'});
      const LogDestruction = instance.LogDestruction({}, {fromBlock: 0, toBlock: 'latest'});
      this.setState({ web3: web3, instance: instance, LogNewFunder: LogNewFunder,
      LogAssetFunded: LogAssetFunded, LogAssetFundingFailed: LogAssetFundingFailed,
      LogAssetPayoutInstaller: LogAssetPayoutInstaller, LogRefund: LogRefund,
      LogFundingTimeChanged: LogFundingTimeChanged, LogAssetEscrowChanged,LogAssetEscrowChanged,
      LogAssetPayoutMyBitFoundation: LogAssetPayoutMyBitFoundation, LogAssetPayoutLockedTokenHolders:
      LogAssetPayoutLockedTokenHolders, LogDestruction:LogDestruction })
    }

    async callInterface(interfaceName) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`]();
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async fund(_assetID){
      const { instance, web3 } = this.state;
      const response = await instance.fund(_assetID,{
        from: web3.eth.coinbase, gas:20000, value: 'GRABVALUE'});
    }

    async payout(_assetID){
      const { instance, web3 } = this.state;
      const response = await instance.payout(_assetID,{
        from: web3.eth.coinbase, gas:20000});
      }

    async initiateRefund(_assetID){
      const { instance, web3 } = this.state;
      const response = await instance.initiateRefund(_assetID,{
        from: web3.eth.coinbase, gas:20000});
      }

    async refund(_assetID){
      const { instance, web3 } = this.state;
      const response = await instance.refund(_assetID,{
        from: web3.eth.coinbase, gas:20000});
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
                {constant.name}
              </button>
            ))}

            {/*  TODO;
                    Grab _assetID from bigchainDB
            */}
            <br />
            {
              <button
              style={{ margin: 'auto', display: 'block' }}
              key={'fund'}
              onClick={() => this.fund(
                $('#fund-_assetID').val()
              )}
              >
              {'Fund'}
              </button>
          }
          _assetID:<input type="text" id="fund-_assetID"></input>


          {/*  TODO;
                  Grab _assetID from bigchainDB
          */}
          <br />
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'payout'}
            onClick={() => this.payout(
              $('#payout-_assetID').val()
            )}
            >
            {'Payout'}
            </button>
          }
          _assetID:<input type="text" id="payout-_assetID"></input>


          {/*  TODO;
                  Grab _assetID from bigchainDB
          */}
          <br />
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'initiateRefund'}
            onClick={() => this.initiateRefund(
              $('#initiateRefund-_assetID').val()
            )}
            >
            {'Initiate Refund'}
            </button>
          }
          _assetID:<input type="text" id="initiateRefund-_assetID"></input>



          {/*  TODO;
                  Grab _assetID from bigchainDB
          */}
          <br />
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'refund'}
            onClick={() => this.refund(
              $('#refund-_assetID').val()
            )}
            >
            {'Refund'}
            </button>
          }
          _assetID:<input type="text" id="refund-_assetID"></input>


          </div>
        );
      }
}

export default FundingHub;
