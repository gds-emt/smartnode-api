/**
 * Override any of the following values at config/local.js
 * Manage different blockchain in separate config files
 *
 * or as other files named at
 * https://github.com/lorenwest/node-config/wiki/Configuration-Files
 */
module.exports = {
  server: {
    port: 4000,
  },

  rpc: {
    host: 'localhost',
    port: 8545,
  },

  admin: {
    account: 0, // Unlocked admin account, either address or int (i-th account at web3.eth.accounts)
    defaultGas: 100000,
  },
};