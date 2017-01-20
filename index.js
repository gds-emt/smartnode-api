const app = require('express')();
const config = require('config');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded()); Uncomment to support x-www-form-urlencoded

app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('X-Powered-By', 'onebit-api');
  next();
});

app.get('/', (req, res) => {
  res.send('Smartnode API');
});

const server = app.listen(config.get('server.port'), () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Smartnode API server is now listening at http://${host}:${port}`);
});