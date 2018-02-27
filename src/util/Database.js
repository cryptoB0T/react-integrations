import { promisifyAll } from 'bluebird'

import ABIInterfaceArray from '../util/abis/Database.json'


const SMART_CONTRACT_ADDRESS = '0x0'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})


export default class Database  {
    
    async load(web3) {
        const abi = await web3.eth.contract(ABIInterfaceArray)
        this.instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS));
    }

    async uintStorage(_bytes32) {
        const uintStored = await this.instance.uintStorageAsync(_bytes32);
        return uintStored;
    }

    async stringStorage(_bytes32) {
        const stringStored = await this.instance.stringStorage(_bytes32);
        return stringStored;
    }

    async addressStorage(_bytes32) {
        const addressStored = await this.instance.addressStorage(_bytes32);
        return addressStored;
    }

    async bytesStorage(_bytes32) {
        const bytesStored = await this.instance.bytesStorage(_bytes32);
        return bytesStored;
    }

    async bytes32Storage(_bytes32) {
        const bytes32Stored = await this.instance.bytes32Storage(_bytes32);
        return bytes32Stored;
    }

    async boolStorage(_bytes32) {
        const boolStored = await this.instance.boolStorage(_bytes32);
        return boolStored;
    }

    async intStorage(_bytes32) {
        const intStored = await this.instance.intStorage(_bytes32);
        return intStored;
    }
}
