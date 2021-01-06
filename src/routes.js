// dependencies
const { sampleHandler } = require('./routeHandler/sampleHandler');
const { userHandler } = require('./routeHandler/userHandler');

// module scaffolding
const routes = {
  sample: sampleHandler,
  user: userHandler,
};

// export routes
module.exports = routes;
