'use strict';
const http = require('http');
const { errorHandler } = require('./common');
const UsersController = require('./users/users.controller');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(async function (req, res) {
  if (/\/api\/users/.test(req.url)) {
    return await UsersController.requestHandler(req, res);
  }

  return errorHandler({ res, code: 404 });
});

server.listen(PORT);