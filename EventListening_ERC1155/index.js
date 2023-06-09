'use strict';
import dotenv from 'dotenv';
dotenv.config();

import Web3 from 'web3';

//프로바이더로 알케미를 선택한다면 간단하게 변경하여 사용 가능.
const API_URL = process.env.ALCHEMY_WSS;
const web3 = new Web3(API_URL);

// const web3 = new Web3("new Web3.providers.IpcProvider('\\\\.\\pipe\\geth.ipc',net)");
console.log(process.env.ALCHEMY_WSS);
const Address = process.env.PERSONAL_ADDRESS;
//테스트 address
const Contract = '0x5899a199a50e957430a597d8e7b2136dc1121e7e';
const TokenId = 1;
//테스트 Contract

let options1155 = {
    topics: [
        web3.utils.sha3('TransferSingle(address,address,address,uint256,uint256)')
    ]
};

let subscription1155 = web3.eth.subscribe('logs', options1155);

subscription1155.on('data', event => {
    let transaction = web3.eth.abi.decodeLog([{
        type: 'address',
        name: 'operator',
        indexed: true
    }, {
        type: 'address',
        name: 'from',
        indexed: true
    }, {
        type: 'address',
        name: 'to',
        indexed: true
    }, {
        type: 'uint256',
        name: 'id'
    }, {
        type: 'uint256',
        name: 'value'
    }],
        event.data,
        [event.topics[1], event.topics[2], event.topics[3]]);

        //블록당 발생하는 전체 ERC-1155 출력
        //만약 from 부분이 0이라면 새로 mint된 것으로 판단.
    console.log(`\n` +
        `New ERC-1155 transaction found in block ${event.blockNumber} with hash ${event.transactionHash}\n` +
        `Operator: ${transaction.operator}\n` +
        `From: ${(transaction.from === '0x0000000000000000000000000000000000000000') ? 'New mint!' : transaction.from}\n` +
        `To: ${transaction.to}\n` +
        `id: ${transaction.id}\n` +
        `value: ${transaction.value}`
    );
})

subscription1155.on('error', err => { throw err });

subscription1155.on('connected', nr => console.log('Subscription on ERC-1155 started with ID %s', nr));