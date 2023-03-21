'use strict';
const http = require('http');
const url = require('url');
const { errorHandler } = require('./common');
const UsersService = require('./users/users.service');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(async function (req, res) {
  const { pathname } = url.parse(req.url);

  if (req.method === 'GET') {
    return await getRequestHandler({ req, res, pathname });
  }

  return errorHandler(res, 404);
});

server.listen(PORT);

async function getRequestHandler({ req, res, pathname }) {
  if (pathname !== '/api/users') {
    errorHandler(res, 404);
  }
  res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });

  res.end(JSON.stringify(await UsersService.getUsers()));
}