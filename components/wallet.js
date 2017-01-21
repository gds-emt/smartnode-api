const web3 = require('./web3');
const { Wallet } = require('./contracts');

const wallet = Wallet.deployed();

function status() {
  return {
    blockNumber: web3.eth.blockNumber,
    wallet: {
      address: wallet.address,
      balance: web3.eth.getBalance(wallet.address),
    },
  };
}

module.exports = { status };
