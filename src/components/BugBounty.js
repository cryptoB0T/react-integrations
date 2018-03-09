import React, { Component } from 'react'
import $ from 'jquery'

import { promisifyAll } from 'bluebird'
import ABIInterfaceArray from '../util/abis/BugBounty.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x0'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )


class BugBounty extends Component {
    constructor(props) {
      super(props)
      this.state = {
        instance:null,
      }
      this.callConstant = this.callInterface.bind(this);
      this.submitBug = this.submitBug.bind(this);
      this.voteForBug = this.voteForBug.bind(this);
    }

    async componentDidMount() {
      const { web3 } = this.props;
      const abi = await web3.eth.contract(ABIInterfaceArray)
      const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))
      this.setState({ web3: web3, instance: instance })
    }

    async callInterface(interfaceName) {
      const { instance } = this.state;
      const response = await instance[`${interfaceName}Async`]();
      alert(`The result from calling ${interfaceName} is ${response}`);
    }

    async submitBug(_severity){
      const { instance, web3 } = this.state;
      if(_severity > 0 && _severity < 4){
        instance.submitBug.estimateGas(
          _severity,
          {from:web3.eth.coinbase},
          async function(e, gasEstimate){
            if(!e){
              const response = await instance.submitBugAsync(
                _severity,
                {from: web3.eth.coinbase, gas:20000}
              );
            }
          }
        )
      }
    }

    /* TODO; grab bug ID*/
    async voteForBug(_bugID, _upvote){
      const { instance, web3 } = this.state;
      instance.voteForBug.estimateGas(
        _bugID, _upvote,
        {from:web3.eth.coinbase},
        async function(e, gasEstimate){
          if(!e){
            const response = await instance.voteForBugAsync(
              _bugID, _upvote,
              {from: web3.eth.coinbase, gas:20000}
            );
          }
        }
      )
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

            {/*  TODO;  */}
            <br />
            {
              <button
              key={'submitBug'}
              onClick={() => this.submitBug($('#bugseverity-select :selected').val())}
              >
              {'Submit Bug'}
              </button>
            }
            <select id='bugseverity-select'>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>

            <br />
            <br />
              {
                <button
                key={'voteForBug'}
                onClick={() => this.voteForBug(
                  $('#voteForBug-_bugID').val(),
                  $('#voteForBug-select :selected').val()
                )}
                >
                {'Vote Bug'}
                </button>
              }
              _bugID:<input type="text" id="voteForBug-_bugID"></input>
              <select id='voteForBug-select'>
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
              <br /><br /><br /><br />

          </div>
        );
      }
    }


export default BugBounty;
