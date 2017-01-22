const app = require('express')();
const config = require('config');
const bodyParser = require('body-parser');

const wallet = require('./components/wallet');
const rates = require('./components/rates');

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded()); Uncomment to support x-www-form-urlencoded

app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('X-Powered-By', 'smartnode-api');
  next();
});

app.get('/', (req, res) => {
  res.send('Smartnode API');
});

app.get('/status', (req, res) => {
  res.send(wallet.status());
});

app.get('/ethsgd', (req, res) => {
  rates.ETHSGD().then(value => res.send(value));
});

app.get('/transactions', (req, res) => {
  wallet.transactions().then(response => res.send(response));
});

const server = app.listen(config.get('server.port'), () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Smartnode API server is now listening at http://${host}:${port}`);
});
