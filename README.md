# Reactjs Integrations & Storybook Examples

*Simple example showcasing integrating Reactjs to multiple APIs, as well as showcasing the creation of a story using Storybook.js*

## Included APIs

- Web3.js
- Uphold.js

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
  import ABIInterfaceArray from './util/ABI.json'
  
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

## Used Libraries

- Storybook.js

## Storybook.js

### Overview

Storybook is a development environment for UI components. It allows you to browse a component library, view the different states of each component, and interactively develop and test components.

### Storybook example

This storybook includes a story for:

- `.components/Accounts` - test react component

### Build Instructions

First install:

```sh
cd react-integrations
npm install
```

Once it's installed, you can `npm run storybook` and it will run the development server on your local machine, and give you a URL to browse the Accounts example story.

#### Exporting the Storybook

```sh
npm run build-storybook
```

This will generate the required files so that the storybook can be deployed as a static application. It exports the files to a directory named ".out".

## Metamask Accounts

Jose - 0x6442c72aBD1a9d14c303277a8C994Fae295b6BCB
Kamuela - 0x1B7E28DB9af81ce2cf35480C7b0Ef82CcD011AC9
