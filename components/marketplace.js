/**
 * Marketplace
 * listing available SmartNode services
 * Replaceable with a Marketplace smart contract
 */
const config = require('config');

const honestbee = {
  id: 'honestbee',
  name: 'honestbee',
  icon: 'https://pbs.twimg.com/profile_images/743759173834334209/GcCRFPRh.jpg',
  address: config.get('marketplace.honestbee'),
  description: 'Ordering of groceries',
  params: ['order_id'],
};

module.exports = { honestbee };
