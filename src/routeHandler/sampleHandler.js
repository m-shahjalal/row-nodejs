// module scaffolding
const handler = {};

handler.sampleHandler = (request, callback) => {
  console.log(request);
  callback(200, {
    message: 'sample request',
  });
};

// export handler
module.exports = handler;
