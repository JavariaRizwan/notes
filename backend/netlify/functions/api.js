const serverless = require("serverless-http");
const app = require("../../app");

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  event.path = event.path.replace(/^\/\.netlify\/functions\/api/, "/api");
  return handler(event, context);
};