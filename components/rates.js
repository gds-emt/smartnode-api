const Client = require('coinbase').Client;
const config = require('config');

const client = new Client(config.get('ext.coinbase'));

function get(currencyPair = 'ETH-SGD') {
  return new Promise((resolve, reject) => {
    client.getBuyPrice({ currencyPair }, (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res.data.amount);
    });
  });
}

function ETHSGD() {
  return get('ETH-SGD');
}

module.exports = { get, ETHSGD };
