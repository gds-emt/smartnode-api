const web3 = require('./web3');

/**
 * Returns address, either:
 * i. web3.eth.accounts[i] (if i is int), or
 * ii. i (if i is string)
 * @return Ethereum address
 */
function getAddress(i) {
  if (Number.isInteger(i)) {
    return web3.eth.accounts[i];
  }
  return i;
}

module.exports = { getAddress };
