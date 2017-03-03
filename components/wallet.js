const config = require('config');
const web3 = require('./web3');
const { getAddress } = require('./utils');
const { Wallet } = require('./contracts');
const { list: txlist } = require('./transactions');

const wallet = Wallet.deployed();
const owner = getAddress(config.get('eth.walletOwnerAccount'));

function status() {
  return {
    blockNumber: web3.eth.blockNumber,
    wallet: {
      address: wallet.address,
      balance: web3.eth.getBalance(wallet.address),
    },
  };
}

function transactions() {
  return txlist();
}

function makeRequest(serviceAddress, value, _params, description) {
  const params = (typeof _params === 'string') ? _params : JSON.stringify(_params);

  return Wallet.deployed().makeRequest(serviceAddress, value, params, description, {
    from: owner,
    gas: config.get('eth.defaultGas'),
  });
}

function send(address, value) {
  return Wallet.deployed().send(address, web3.toBigNumber(value), {
    from: owner,
    gas: config.get('eth.defaultGas'),
  });
}

module.exports = { status, transactions, makeRequest, send };
