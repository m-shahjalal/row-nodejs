// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../routeHandler/notFoundHandler');
const { parsedJSON } = require('./utilities');

// handle object -scaffolding
const handler = {};

// main function
handler.handleReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  const queryObject = parsedUrl.query;
  const method = req.method.toLowerCase();
  const headerObject = req.headers;

  const requestObject = {
    path,
    queryObject: { ...queryObject },
    method,
    headerObject,
  };
  console.log(requestObject);

  const decoder = new StringDecoder('utf-8');
  let data = '';

  const chosenRoute = routes[path] ? routes[path] : notFoundHandler;
  req.on('data', (buffer) => {
    data += decoder.write(buffer);
  });
  req.on('end', () => {
    data += decoder.end();

    requestObject.body = parsedJSON(data);

    chosenRoute(requestObject, (status, response) => {
      const statusCode = typeof status === 'number' ? status : 500;
      const payload = typeof response === 'object' ? response : {};

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(JSON.stringify(payload));
    });

    console.log(data);
  });
};

module.exports = handler;
