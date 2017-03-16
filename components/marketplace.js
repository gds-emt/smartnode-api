/**
 * Marketplace
 * listing available SmartNode services
 * Replaceable with a Marketplace smart contract
 */
const config = require('config');

const honestbee = {
  id: 'honestbee',
  name: 'honestbee',
  icon: 'https://s3-ap-southeast-1.amazonaws.com/smartnode-services/honestbee.jpg',
  address: config.get('marketplace.honestbee'),
  description: 'Ordering of groceries',
  params: ['order_id'],
};

module.exports = { honestbee };
