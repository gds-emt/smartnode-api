/**
 * Override any of the following values at config/local.js
 * Manage different blockchain in separate config files
 *
 * or as other files named at
 * https://github.com/lorenwest/node-config/wiki/Configuration-Files
 */
module.exports = {
  server: {
    port: 4000, // http port

    https: {
      port: 8443, // leave null to disable https
      key: 'path/to/key.pem',
      cert: 'path/to/cert.pem',
    },
  },

  rpc: {
    host: 'localhost',
    port: 8545,
  },

  eth: {
    walletOwnerAccount: 0, // Unlocked account, either address or int (i-th account at web3.eth.accounts)
    defaultGas: 300000,
  },

  ext: {
    /**
     * For ETHSGD rates only
     */
    coinbase: {
      apiKey: 'COINBASE API KEY',
      apiSecret: 'COINBASE API SECRET',
    },
  },

  /**
   * To manually specify contract address of services
   * This can be done away when we have a Marketplace smart contract
   */
  marketplace: {
    honestbee: '0xxxxxxxxxxxxxxxxxxxxxx',
  },
};
