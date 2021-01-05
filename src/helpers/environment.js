// module scaffolding
const environments = {};

environments.staging = {
  port: 5000,
  name: 'staging',
};

environments.production = {
  port: 8080,
  name: 'production',
};

const currentEnvironment =
  typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

const environmentToExport =  typeof environments[currentEnvironment] === 'object'
    ? environments[currentEnvironment]
    : environments.staging;

// export module
module.exports = environmentToExport;
