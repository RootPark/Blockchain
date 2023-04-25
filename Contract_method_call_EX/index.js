'use strict';
import dotenv from 'dotenv';
dotenv.config();

import { readFile } from 'fs/promises';
import Web3 from 'web3';

const web3 = new Web3(process.env.ALCHEMY_ENDPOINT);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractAbi = JSON.parse(await readFile(new URL('./contract-abi.js' ,import.meta.url)));

const contract = new web3.eth.Contract(contractAbi, contractAddress);

const str = await contract.methods.sayHelloWorld().call();

console.log(str);