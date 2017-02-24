const { Wallet } = require('./contracts');
const web3 = require('./web3');

const wallet = Wallet.deployed();

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

function list() {
  const TransferEvent = new Promise((resolve, reject) => {
    wallet.Transfer({}, { fromBlock: 0, toBlock: 'latest' }).get((err, results) => {
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
          transactionhash: result.transactionHash,
          value: args._value.toString(),
        };
        if (args._from === wallet.address) {
          transaction.type = 'send';
          transaction.address = args._to;
        } else {
          transaction.type = 'receive';
          transaction.address = args._from;
        }
        transactions.push(transaction);
      });
      return resolve(transactions);
    });
  });

  const RequestMadeEvent = new Promise((resolve, reject) => {

  });

  return Promise.all([TransferEvent]).then((results) => {
    const response = results[0].concat(demo);
    response.sort((a, b) => b.timestamp - a.timestamp); // descending
    return response;
  });
}

module.exports = { list };
