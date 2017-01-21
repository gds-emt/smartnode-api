/* eslint global-require: "off" */
/* eslint import/no-dynamic-require: "off" */
const fs = require('fs');
const path = require('path');
const web3 = require('./web3');

const builtContractsPath = path.join(__dirname, '../build/contracts/');
const contracts = {};

fs.readdirSync(builtContractsPath).forEach((file) => {
  const name = file.replace(/\.sol\.js$/g, '');
  contracts[name] = require(path.join(builtContractsPath, file));
  contracts[name].setProvider(web3.currentProvider);
});

module.exports = contracts;
