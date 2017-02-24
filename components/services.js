const marketplace = require('./marketplace');
const wallet = require('./wallet');
const web3 = require('./web3');
// const { Wallet } = require('./contracts');
// const { SNServiceInterface: Service } = require('./contracts');

function handle(id, value, params, _description = null) {
  return new Promise((resolve, reject) => {
    if (!marketplace[id]) {
      return reject('No services found');
    }

    if (wallet.status().wallet.balance.lt(web3.toBigNumber(value))) {
      return reject('Insufficient balance');
    }

    const description = _description || marketplace[id].description;

    // Purposely not waiting for it to be mined
    wallet.makeRequest(marketplace[id].address, value, params, description).catch((err) => {
      console.warn(err);
    });

    return resolve('Request successfully made');
  });
}

module.exports = { handle };
