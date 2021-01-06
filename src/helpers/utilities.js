// dependencies
const crypto = require('crypto');
const environment = require('./environment');

// module scaffoldings
const utilities = {};

// parsed JSON
utilities.parsedJSON = (str) => {
  let output;
  try {
    output = JSON.parse(str);
  } catch (error) {
    output = {};
  }
  return output;
};

// hash string
utilities.hash = (str) => {
  if (typeof str === 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', environment.secretKey).update(str).digest('hex');
    return hash;
  }
};

// export modules
module.exports = utilities;
