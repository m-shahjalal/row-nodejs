// module scaffolding
const handler = {};

handler.userHandler = (request, callback) => {
  console.log(request);
  callback(200, {
    message: 'user request',
  });
};

// export handler
module.exports = handler;
