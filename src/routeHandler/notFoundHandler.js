// module scaffolding
const handler = {};

handler.notFoundHandler = (request, callback) => {
  console.log(request);
  callback(404, { message: 'Not Found' });
};

// export handler
module.exports = handler;
