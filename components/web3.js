/**
 * Consistently returns initialized web3
 */
/* global web3:true */
const Web3 = require('web3');
const config = require('config');

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  const provider = `http://${config.rpc.host}:${config.rpc.port}`;
  web3 = new Web3(new Web3.providers.HttpProvider(provider));
}

module.exports = web3;
