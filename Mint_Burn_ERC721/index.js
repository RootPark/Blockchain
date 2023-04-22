'use strict';
import dotenv from 'dotenv';
dotenv.config();

import Web3 from 'web3';

let API_URL = process.env.ALCHEMY_WSS; //alchemy websocket api
let web3 = new Web3(API_URL);

const MY_ADDRESS = process.env.PERSONAL_ADDRESS.substring(2); //16진수 표현 0x를 빼기 위함.

const BURN_ADDRESS = '000000000000000000000000000000000000dead'; //소각 주소

async function main() {
  let nonce = await web3.eth.getTransactionCount(MY_ADDRESS, 'latest');
  const mintAddress = '0000000000000000000000000000000000000000000000000000000000000000'; //Mint address
  const tokenId = '0000000000000000000000000000000000000000000000000000000000000002'; //토큰 ID

  try {
    const mintInputData = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
      + mintAddress
      + '000000000000000000000000'
      + MY_ADDRESS
      + tokenId; //Mint data format

    const signMintTrx = await web3.eth.accounts.signTransaction({
      from: MY_ADDRESS,
      to: process.env.CONTRACT_ADDRESS,
      data: mintInputData,
      gas: 2000000,
      nonce: nonce,
    }, process.env.PRIVATE_KEY);
    nonce+=1;

    web3.eth.sendSignedTransaction(signMintTrx.rawTransaction, function (error, hash) {
      if (!error) {
        console.log("The hash of your MINT transaction is: ", hash, "\n");
      }
      else {
        console.log("MINT TRANSACTION ERROR", error);
      }
    });
  } catch (err) {
    console.log("MINT SIGN ERROR");
  }

  try {
    const burnInputData = '0x42842e0e000000000000000000000000'
      + MY_ADDRESS
      + '000000000000000000000000'
      + BURN_ADDRESS
      + tokenId; //SafeTranferFrom data format

    const signBurnTx = await web3.eth.accounts.signTransaction({
      to: process.env.CONTRACT_ADDRESS,
      data: DATA_INPUT,
      gas: 2000000,
      nonce: nonce,
    }, process.env.PRIVATE_KEY);

    web3.eth.sendSignedTransaction(signBurnTx.rawTransaction, function (error, hash) {
      if (!error) {
        console.log("The hash of your BURN transaction is: ", hash, "\n");
      }
      else {
        console.log("BURN TRANSACTION ERROR", error);
      }
    });
  } catch (err) {
    console.log("BURN SIGN ERROR");
  }
}

main();

