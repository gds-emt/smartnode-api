const express = require('express');
const fs = require('fs');
const https = require('https');
const http = require('http');
const config = require('config');
const bodyParser = require('body-parser');

const app = express();
const wallet = require('./components/wallet');
const rates = require('./components/rates');
const services = require('./components/services');

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
  Promise.all([wallet.status(), wallet.transactions()]).then((responses) => {
    const results = responses[0];
    results.transactions = responses[1];
    res.send(results);
  });
});

app.get('/ethsgd', (req, res) => {
  rates.ETHSGD().then(value => res.send(value));
});

app.post('/services/:id', (req, res) => {
  services.handle(req.params.id, req.body.value, req.body.params, req.body.description).then((response) => {
    res.send(response);
  }, err => res.status(500).send(err.toString()));
});

/*
app.get('/transactions', (req, res) => {
  wallet.transactions().then(response => res.send(response));
});
*/
const server = http.createServer(app).listen(config.get('server.port'), () => {
// const server = app.listen(config.get('server.port'), () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Smartnode API server is now listening at http://${host}:${port}`);
});

/**
 * Starts HTTPS server
 */
if (config.get('server.https') && config.get('server.https.port')) {
  const options = {};
  if (config.get('server.https.key') && config.get('server.https.cert')) {
    options.key = fs.readFileSync(config.get('server.https.key'));
    options.cert = fs.readFileSync(config.get('server.https.cert'));
  }
  const httpsServer = https.createServer(options, app).listen(config.get('server.https.port'), () => {
    const host = httpsServer.address().address;
    const port = httpsServer.address().port;

    console.log(`Smartnode HTTPS API server is now listening at http://${host}:${port}`);
  });
}
