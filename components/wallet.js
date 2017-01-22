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

function transactions() {
  return new Promise((resolve) => {
    const data = [
    {
        type: 'service', // service, receive or send
        time: '2017-01-22T08:08:12Z',
        address: '0xc0ea08a2d404d3172d2add29a45be56da40e2949',
        value: '-4250000000000000000',
        order: {
          name: 'Singapore Power',
          icon: 'https://media.glassdoor.com/sqll/389323/singapore-power-squarelogo-1398797969587.png',
          descrition: 'Power consumption for the month',
          complete: true,
        },
      },
      {
        type: 'service', // service, receive or send
        time: '2017-01-22T08:07:59Z',
        address: '0xc0ea08a2d404d3172d2add29a45be56da40e2949',
        value: '-8540000000000000000',
        order: {
          name: 'honestbee',
          icon: 'https://pbs.twimg.com/profile_images/743759173834334209/GcCRFPRh.jpg',
          descrition: '100 Nespresso capsules',
          complete: false, // still pending refund or processing
        },
      },
      {
        type: 'receive',
        time: '2017-01-20T08:07:59Z',
        address: '0xea674fdde714fd979de3edf0f56aa9716b898ec8',
        value: '25000000000000000000',
      },
      {
        type: 'order', // order, receive or send
        time: '2017-01-18T08:07:59Z',
        address: '0x83d367e3a6b4e3c58d402b324e04472c28e96637',
        value: '-452000000000000000',
        order: {
          name: 'Uber',
          icon: 'http://cdn.geekwire.com/wp-content/uploads/2016/02/uberriderlogo-e1454443856991-300x300.png',
          descrition: 'Ride to office',
          complete: true,
        },
      },
      {
        type: 'send',
        time: '2017-01-10T08:07:59Z',
        address: '0x2a65aca4d5fc5b5c859090a6c34d164135398226',
        value: '-100000000000000000',
      },
    ];
    return resolve(data);
  });
}

module.exports = { status, transactions };
