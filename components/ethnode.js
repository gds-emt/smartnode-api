const web3 = require('./web3');
const config = require('config');
const utils = require('./utils');

function status() {
  return {
    blockNumber: web3.eth.blockNumber,
    address: utils.getAddress(config.get('eth.account')),
  };
}

module.exports = { status };
