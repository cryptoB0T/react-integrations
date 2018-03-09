import React, { Component } from 'react'
import $ from 'jquery';
import { keccak256 } from 'js-sha3';

import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/MarketPlace.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0xfda950b831bb0afa494ad272500eccb7a997f230'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )


class MarketPlace extends Component {
    constructor(props) {
      super(props)
      this.state = {
        web3:null,
        database:null,
        instance:null,
        modifier:null,
        LogDestruction:null,
        LogSellOrderCreated:null,
        LogBuyOrderCreated:null,
        LogBuyOrderCompleted:null,
        LogSellOrderCompleted:null,
        }
      this.callInterface = this.callInterface.bind(this);
      this.buyAsset = this.buyAsset.bind(this);
      this.sellAsset = this.sellAsset.bind(this);
      this.createBuyOrder = this.createBuyOrder.bind(this);
      this.createSellOrder = this.createSellOrder.bind(this);
      this.deleteBuyOrder = this.deleteBuyOrder.bind(this);
      this.deleteSellOrder = this.deleteSellOrder.bind(this);
      this.buyOrderExists = this.buyOrderExists.bind(this);
      this.needsToWithdraw = this.needsToWithdraw.bind(this);
      this.getEventInfo = this.getEventInfo.bind(this);
      this.setEventListeners = this.setEventListeners.bind(this);
    }

    async componentDidMount() {
      const { web3, database, modifier} = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))

      const LogDestruction = instance.LogDestruction({},{fromBlock: 0, toBlock: 'latest'});
      const LogSellOrderCreated = instance.LogSellOrderCreated({},{fromBlock: 0, toBlock: 'latest'});
      const LogBuyOrderCreated = instance.LogBuyOrderCreated({},{fromBlock: 0, toBlock: 'latest'});
      const LogBuyOrderCompleted = instance.LogBuyOrderCompleted({},{fromBlock: 0, toBlock: 'latest'});
      const LogSellOrderCompleted = instance.LogSellOrderCompleted({},{fromBlock: 0, toBlock: 'latest'});

      this.setState({ web3: web3, database: database, modifier: modifier, instance: instance, LogDestruction: LogDestruction,
      LogSellOrderCompleted: LogSellOrderCompleted, LogBuyOrderCreated: LogBuyOrderCreated,
      LogBuyOrderCompleted: LogBuyOrderCompleted, LogSellOrderCompleted: LogSellOrderCompleted})
      this.setEventListeners();
    }

    async setEventListeners(){
      const { instance, web3, LogDestruction, LogSellOrderCreated,
      LogBuyOrderCreated, LogBuyOrderCompleted, LogSellOrderCompleted} = this.state;
      LogDestruction.watch(function(e,r){if(!e){alert('LogDestruction; ' + r);}});
      LogSellOrderCreated.watch(function(e,r){if(!e){alert('LogSellOrderCreated; ' + r);}});
      LogBuyOrderCreated.watch(function(e,r){if(!e){alert('LogBuyOrderCreated; ' + r);}});
      LogBuyOrderCompleted.watch(function(e,r){if(!e){alert('LogBuyOrderCompleted; ' + r);}});
      LogSellOrderCompleted.watch(function(e,r){if(!e){alert('LogSellOrderCompleted; ' + r);}});
    }


    async callInterface(interfaceName, _param) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`](_param);
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async buyAsset(_sellOrderID){
      const { instance, web3 } = this.state;
    /*  instance.sellOrders.call(_sellOrderID, async function(e,order){
          var valueCost = Number(order[2]) * Number(order[3]); //TODO; wei return need to test
          if(this.needsToWithdraw(
            order[0], order[1]) &&
            modifier.onlyApproved(4)){
              instance.buyAsset.estimateGas(
                _sellOrderID,
                {from:web3.eth.coinbase, value:valueCost},
                async function(e, gasEstimate){
                  if(!e){
                    console.log(gasEstimate);
                    const response = await instance.buyAssetAsync(
                    _sellOrderID,
                    {from:web3.eth.coinbase,
                    gas:gasEstimate,
                    value: valueCost}
                    )
                  }
            })
          }
      })*/
      /*const response = await instance.buyAssetAsync(
      _sellOrderID,
      {from:web3.eth.coinbase,
      gas:gasEstimate,
      value: valueCost}*/

      instance.sellOrders.call(_sellOrderID, async function(e,order){
          var valueCost = Number(order[2]) * Number(order[3])
          const response = await instance.buyAssetAsync(
          _sellOrderID,
          {from:web3.eth.coinbase,
          gas:210000,
          value: valueCost});
        });
    }


    // TODO; grab assetID
    async sellAsset(_buyOrderID){
      const { instance, web3, modifier } = this.state;
    /*  this.buyOrderExists.call(_buyOrderID, async function(e,order){
        var valueCost = Number(order[2]) * Number(order[3]);
        instance.sellAsset.estimateGas(
            _buyOrderID,
            {from:web3.eth.coinbase, value:valueCost},
            async function(e, gasEstimate){
              if(!e){
                console.log(gasEstimate);
                const reponse = await instance.sellAssetAsync(
                  _buyOrderID,
                  {from:web3.eth.coinbase,
                  gas:gasEstimate,
                  value:valueCost})
                }
              }
            )
          }
        );*/
        this.buyOrderExists.call(_buyOrderID, async function(e,order){
            var valueCost = Number(order[2]) * Number(order[3]);
            const reponse = await instance.sellAssetAsync(
              _buyOrderID,
              {from:web3.eth.coinbase,
              gas:210000,
              value:valueCost});
            });

      }


    // TODO; grab assetID
    async createBuyOrder(_amount, _price, _assetID){
      const { instance, web3, modifier } = this.state;

      if(modifier.notZero(_amount) &&
         modifier.notZero(_price) &&
         modifier.onlyApproved(4) &&
         modifier.atStage(_assetID, 4)
        ){
          var valueDeposit = _amount * _price;
          const response = await instance.createBuyOrder(_amount, _price, _assetID,{
            from: web3.eth.coinbase, gas:20000, value : web3.fromWei(valueDeposit)});
            }
        }


    async createSellOrder(_amount, _price, _assetID){
      const { instance, web3, modifier } = this.state;
      if(modifier.notZero(_amount) &&
         modifier.notZero(_price) &&
         modifier.onlyApproved(4) &&
         modifier.atStage(_assetID, 4) &&
         modifier.hasEnoughShares(_assetID, _amount)
       ){
         var valueDeposit = _amount * _price;
         const response = await instance.createSellOrder(_amount, _price, _assetID,{
           from: web3.eth.coinbase, gas:20000, value : web3.fromWei(valueDeposit)});
       }
     }

    async deleteBuyOrder(_orderID){
      const { instance, web3, modifier } = this.state;
      if(modifier.onlyApproved(4)){
        instance.deleteBuyOrder.estimateGas(
            _orderID,
            {from:web3.eth.coinbase},
            async function(e, gasEstimate){
              if(!e){
                const response = await instance.deleteBuyOrderAsync(_orderID,{
                  from: web3.eth.coinbase, gas:20000});
                }
              })
            }
          }

    async deleteSellOrder(_orderID){
      const { instance, web3, modifier } = this.state;
      if(modifier.onlyApproved(4)){
        instance.deleteSellOrder.estimateGas(
            _orderID,
            {from:web3.eth.coinbase},
            async function(e, gasEstimate){
              if(!e){
                const response = await instance.deleteSellOrderAsync(_orderID,{
                  from: web3.eth.coinbase, gas:gasEstimate});
                }
              }
            )
          }
        }

    async withdraw(){
      const { instance, web3, modifier } = this.state;
        if(modifier.onlyApproved(4)){
          instance.withdraw.estimateGas(
              {from:web3.eth.coinbase},
              async function(e, gasEstimate){
                if(!e){
                  const response = await instance.withdrawAsync({
                    from: web3.eth.coinbase, gas:20000});
                  }
                }
              )
            }
          }

    async buyOrderExists(_orderID) {
      const { instance } = this.state;
      return (instance.buyOrders[_orderID].amount !== 0);
      }



    async needsToWithdraw(_assetID, _seller) {
      const { database } = this.state;
      var totalReceived = database.uintStorage(keccak256("totalReceived", _assetID));
      var payment1 = totalReceived * database.uintStorage(keccak256("shares", _assetID, _seller));
      var payment2 = payment1 / database.uintStorage(keccak256("amountRaised", _assetID));
      var finalPayment = payment2 - database.uintStorage(keccak256("totalPaidToFunder", _assetID, _seller));
      return (finalPayment === 0);
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

    render() {
        return (
          <div>
            {
              constantsFromInterface.map( constant => (
              <button
                style={{ margin: 'auto', display: 'block' }}
                key={constant.name}
                onClick={() => this.callInterface(constant.name, '_param')}
                >
                {constant.name}
              </button>
            ))}

            <br />
            {
              <button
              style={{ margin: 'auto', display: 'block' }}
              key={'buyAsset'}
              onClick={() => this.buyAsset(
                $('#marketPlace-_buyOrderID').val()
              )}
              >
              {'Buy Asset'}
              </button>
          }
          _buyOrderID:<input type="text" id="marketPlace-_buyOrderID"></input>


          <br />
          <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'sellAsset'}
            onClick={() => this.sellAsset(
                $('#marketPlace-_sellOrderID').val()
            )}
            >
            {'Sell Asset'}
            </button>
          }
          _sellOrderID:<input type="text" id="marketPlace-_sellOrderID"></input>


          {/*  TODO;  */}
          <br /><br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'createBuyOrder'}
            onClick={() => this.createBuyOrder(
              $('#marketPlace-buyorder_amount').val(),
              $('#marketPlace-buyorder_price').val(),
              $('#marketPlace-buyorder_assetID').val()
            )}
            >
            {'Create Buy Order'}
            </button>
          }
          _amount:<input type="text" id="marketPlace-buyorder_amount"></input>
          _price:<input type="text" id="marketPlace-buyorder_price"></input>
          _assetID:<input type="text" id="marketPlace-buyorder_assetID"></input>




          {/*  TODO;  */}
          <br />  <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'createSellOrder'}
            onClick={() => this.createSellOrder(
              $('#marketPlace-sellorder_amount').val(),
              $('#marketPlace-sellorder_price').val(),
              $('#marketPlace-sellorder_assetID').val()
             )}
            >
            {'Create Sell Order'}
            </button>
          }
          _amount:<input type="text" id="marketPlace-sellorder_amount"></input>
          _price:<input type="text" id="marketPlace-sellorder_price"></input>
          _assetID:<input type="text" id="marketPlace-sellorder_assetID"></input>


          {/*  TODO;  */}
          <br />  <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'deleteBuyOrder'}
            onClick={() => this.deleteBuyOrder(
              $('#marketPlace-_deletebuy_orderID').val()
            )}
            >
            {'Delete Buy Order'}
            </button>
          }
          _orderID:<input type="text" id="marketPlace-_deletebuy_orderID"></input>



          {/*  TODO;  */}
          <br />  <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'deleteSellOrder'}
            onClick={() => this.deleteSellOrder(
              $('#marketPlace-deletesellorder_orderID').val()
            )}
            >
            {'Delete Sell Order'}
            </button>
          }
          _orderID:<input type="text" id="marketPlace-deletesellorder_orderID"></input>


          {/*  TODO;  */}
          <br /> <br />
          {
            <button
            style={{ margin: 'auto', display: 'block' }}
            key={'withdraw'}
            onClick={() => this.withdraw()}
            >
            {'Withdraw'}
            </button>
          }
          <br /><br /><br /><br />

          </div>
        );
      }
}

export default MarketPlace;
