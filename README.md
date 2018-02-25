# Reactjs Integrations Example

*Simple example showcasing integrating Reactjs to multiple APIs*

## Included APIs

- Web3.js
- Uphold.js
- Coinbase.js

## Uphold.js

### Overview

Uphold is a simple crypto-to-fiat third-party provider that allows

## Web3.js

### Overview

#### Setup

Unlike normal React.js applications, Web3 powered ones need first to connect to a
network in order to be able to communicate with any smart contract. The easiest way
to do so through a normal browser is [MetaMask](https://metamask.io/), and then using
their [faucet](https://faucet.metamask.io) to fill some ETH.

#### Connecting to Web3

After setting up MetaMask, create an asynchronous Web3 wrapper in order to perform
basic calls against our own account. Under `util` you can see `web3.js` that exports
a Promisified Web3 function using [Bluebird](http://bluebirdjs.com/docs/getting-started.html)
`promisifyAll`. This is called in `App.js` using `getWeb3Async` which returns a `web3`
instance allowing you to perform actions towards a contract.

#### Calling a contract

Before interacting with a contract, you need to make sure you have its Application Binary
Interface (ABI). Then, initialize the contract address through the previously `web3` instance
and call their functions using the suffix from `instancePromisifier`. Thanks to Bluebird,
we can also perform asynchronous calls against the methods available in the contract.

```
  import { promisifyAll } from 'bluebird'
  import ABIInterfaceArray from './util/abis/ABI.json'

  const SMART_CONTRACT_INSTANCE = '0xb3b18AfbE291E50E652ba5e3faFAbf0b566b804B'
  const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})

  const abi = await web3.eth.contract(ABIInterfaceArray)
  const instance = instancePromisifier(abi.at(SMART_CONTRACT_INSTANCE))
```

In case you want to update this to fit another contract, we would need to replace
`SMART_CONTRACT_INSTANCE` value for another contract address, and update the `ABI.json` to fit
this new contract.

#### Methods available

The ABI describes the methods and constants that can be used. A normal example
would look like the following, assuming `allFunders` is a method available in our
contract.

```
  async callAllFunders() {
    const { instance } = this.state;
    const response = await instance.allFundersAsync();
    alert(`The result from calling allFunders is ${response}`);
  }
```

The metaprogrammed (dynamic function creation) version would look like this.

```
  async callInterface(interfaceName) {
    const { instance } = this.state;
    const response = await instance[`${interfaceName}Async`]();
    alert(`The result from calling ${interfaceName} is ${response}`);
  }
```
