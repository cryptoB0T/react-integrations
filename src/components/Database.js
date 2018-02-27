import React, { Component } from 'react'
import $ from 'jquery';

import { promisifyAll } from 'bluebird'
import { getWeb3Async } from './util/web3'

import ABIInterfaceArray from '../util/abis/Database.json'

import '../App.css';

const SMART_CONTRACT_ADDRESS = '0x0'
const instancePromisifier = (instance) => promisifyAll(instance, { suffix: 'Async'})
const web3 = await getWeb3Async()
const constantsFromInterface = ABIInterfaceArray.filter( ABIinterface => ABIinterface.constant )
const instance = instancePromisifier(abi.at(SMART_CONTRACT_ADDRESS))


export const Database = {
    async uintStorage(_bytes32) {
        const uintStored = await instance.uintStorageAsync(_bytes32);
        return uintStored;
    },

    async stringStorage(_bytes32) {
        const stringStored = await instance.stringStorage(_bytes32);
        return stringStored;
    },

    async addressStorage(_bytes32) {
        const addressStored = await instance.addressStorage(_bytes32);
        return addressStored;
    },

    async bytesStorage(_bytes32) {
        const bytesStored = await instance.bytesStorage(_bytes32);
        return bytesStored;
    },

    async bytes32Storage(_bytes32) {
        const bytes32Stored = await instance.bytes32Storage(_bytes32);
        return bytes32Stored;
    },

    async boolStorage(_bytes32) {
        const boolStored = await instance.boolStorage(_bytes32);
        return boolStored;
    },

    async intStorage(_bytes32) {
        const intStored = await instance.intStorage(_bytes32);
        return intStored;
    },
}
