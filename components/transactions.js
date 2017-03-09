const { Wallet, SNServiceInterface } = require('./contracts');
const marketplace = require('./marketplace');
const web3 = require('./web3');

const wallet = Wallet.deployed();
const servicesByAddress = [];

// Cache
const cache = {
  lastBlock: -1,
  rebuild: false,
  response: [],
};

const demo = [
  {
    type: 'service', // service, receive or send
    timestamp: 1485072490,
    address: '0xc0ea08a2d404d3172d2add29a45be56da40e2949',
    value: '-4250000000000000000',
    demo: true,
    service: {
      name: 'Singapore Power',
      icon: 'https://media.glassdoor.com/sqll/389323/singapore-power-squarelogo-1398797969587.png',
      description: 'Power consumption for the month',
      complete: true,
    },
  },
  {
    type: 'service', // service, receive or send
    timestamp: 1485072472,
    address: '0xc0ea08a2d404d3172d2add29a45be56da40e2949',
    value: '-8540000000000000000',
    demo: true,
    service: {
      name: 'honestbee',
      icon: 'https://pbs.twimg.com/profile_images/743759173834334209/GcCRFPRh.jpg',
      description: '100 Nespresso capsules',
      complete: false, // still pending refund or processing
    },
  },
  {
    type: 'receive',
    timestamp: 1484899679,
    address: '0xea674fdde714fd979de3edf0f56aa9716b898ec8',
    value: '25000000000000000000',
    demo: true,
  },
  {
    type: 'service', // order, receive or send
    timestamp: 1484726879,
    address: '0x83d367e3a6b4e3c58d402b324e04472c28e96637',
    value: '-452000000000000000',
    demo: true,
    service: {
      name: 'Uber',
      icon: 'https://pbs.twimg.com/profile_images/697242369154940928/p9jxYqy5.png',
      description: 'Ride to office',
      complete: true,
    },
  },
  {
    type: 'send',
    timestamp: 1484035679,
    address: '0x2a65aca4d5fc5b5c859090a6c34d164135398226',
    value: '-100000000000000000',
    demo: true,
  },
];

function getServiceByAddress(address) {
  if (servicesByAddress.length === 0) {
    const names = Object.keys(marketplace);
    names.forEach((name) => {
      const service = marketplace[name];
      servicesByAddress[service.address] = service;
    });
  }

  if (servicesByAddress[address]) {
    return servicesByAddress[address];
  }
  return null;
}

/**
 * Get remarks from service contract
 */
function getRemarks(address, blockNumber) {
  return new Promise((resolve, reject) => {
    const service = SNServiceInterface.at(address);
    service.RequestUpdate({}, { fromBlock: blockNumber, toBlock: blockNumber }).get((err, event) => {
      if (err) {
        return reject(err);
      }
      return resolve(event[0].args._remarks);
    });
  });
}

function list() {
  const TransferEvent = new Promise((resolve, reject) => {
    wallet.Transfer({}, { fromBlock: cache.lastBlock + 1, toBlock: 'latest' }).get((err, results) => {
      if (err) {
        return reject(err);
      }
      const transactions = [];
      results.forEach((result) => {
        const args = result.args;
        const block = web3.eth.getBlock(result.blockNumber);
        const transaction = {
          blockNumber: result.blockNumber,
          blockHash: result.blockHash,
          timestamp: block.timestamp,
          transactionHash: result.transactionHash,
          value: args._value,
        };

        if (args._from === wallet.address) {
          transaction.type = 'send';
          transaction.address = args._to;
          transaction.value = transaction.value.times(-1);
        } else {
          transaction.type = 'receive';
          transaction.address = args._from;
        }
        transactions.push(transaction);

        // Reset cache
        if (result.blockNumber > cache.lastBlock) {
          cache.lastBlock = result.blockNumber;
          cache.rebuild = true;
        }
      });
      return resolve(transactions);
    });
  });

  const RequestMadeEvent = new Promise((resolve, reject) => {
    wallet.RequestMade({}, { fromBlock: cache.lastBlock + 1, toBlock: 'latest' }).get((err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });

  const RequestRefundedEvent = new Promise((resolve, reject) => {
    wallet.RequestRefunded({}, { fromBlock: cache.lastBlock + 1, toBlock: 'latest' }).get((err, results) => {
      if (err) {
        return reject(err);
      }

      const remarksPromises = [];
      results.forEach((result) => {
        remarksPromises.push(getRemarks(result.args._service, result.blockNumber));
      });
      return Promise.all(remarksPromises).then((remarks) => {
        const refunds = results.map((result, i) => Object.assign({}, result, { remarks: remarks[i] }));
        return resolve(refunds);
      });
    });
  });

  return Promise.all([TransferEvent, RequestMadeEvent, RequestRefundedEvent]).then((results) => {
    if (!cache.rebuild) {
      return cache.response;
    }

    let response = cache.response.concat(results[0]);
    if (cache.response.length === 0) {
      response = results[0].concat(demo);
    }

    const reqIndex = {};
    const refIndex = {};
    const toRemoveFromMain = {};
    if (results[1] && results[1].length > 0) {
      const requests = results[1];
      requests.forEach((request) => {
        reqIndex[request.blockNumber.toString() + request.args._service] = request;
      });
    }
    if (results[2] && results[2].length > 0) {
      const refunds = results[2];
      refunds.forEach((refund) => {
        if (!refIndex[refund.args._requestId + refund.args._service]) {
          refIndex[refund.args._requestId + refund.args._service] = [];
        }
        refIndex[refund.args._requestId + refund.args._service].push(refund);
      });
    }

    response.map((res) => {
      if (res.demo) {
        return res;
      }

      const newRes = res;

      if (res.type === 'send' && reqIndex[res.blockNumber.toString() + res.address]) {
        const req = reqIndex[res.blockNumber.toString() + res.address];
        const service = getServiceByAddress(res.address);
        if (!service) {
          console.log(`No service found at address ${res.address}`);
        }
        const requestId = req.args._requestId;
        newRes.type = 'service';
        newRes.service = service;
        newRes.service.requestId = requestId;
        newRes.service.complete = false;
        if (req.args._description) {
          newRes.service.description = req.args._description;
        }

        newRes.transactions = [];
        newRes.transactions.push({
          blockNumber: res.blockNumber,
          blockHash: res.blockHash,
          timestamp: res.timestamp,
          transactionHash: res.transactionHash,
          type: 'send',
          value: res.value,
        });

        // Fill in other transactions
        if (refIndex[requestId + service.address]) {
          const refunds = refIndex[requestId + service.address];
          refunds.forEach((refund) => {
            const refundValue = refund.args._value;
            newRes.transactions.push({
              blockNumber: refund.blockNumber,
              blockHash: refund.blockHash,
              timestamp: web3.eth.getBlock(refund.blockNumber).timestamp,
              transactionHash: refund.transactionHash,
              type: 'receive',
              value: refundValue,
              remarks: refund.remarks,
            });
            newRes.service.complete = true;
            newRes.value = newRes.value.plus(refundValue);

            toRemoveFromMain[refund.blockNumber.toString() + refund.args._service] = true;
          });
        }
      }

      return newRes;
    });

    response = response.filter(res => (res.demo || !toRemoveFromMain[res.blockNumber.toString() + res.address]));

    response.sort((a, b) => b.timestamp - a.timestamp); // descending

    cache.response = response;
    cache.rebuild = false;
    return response;
  });
}

module.exports = { list, getRemarks };
