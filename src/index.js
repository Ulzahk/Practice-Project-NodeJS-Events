'use strict';
const http = require('http');
const url = require('url');
const { errorHandler, getReqData } = require('./common');
const UsersService = require('./users/users.service');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(async function (req, res) {
  if (req.method === 'GET') {
    return await getRequestHandler(req, res);
  }
  if (req.method === 'POST') {
    return await postRequestHandler(req, res);
  }
  if (req.method === 'PUT') {
    return await putRequestHandler(req, res);
  }
  if (req.method === 'DELETE') {
    return await deleteRequestHandler(req, res);
  }

  return errorHandler(res, 404);
});

server.listen(PORT);

async function getRequestHandler(req, res) {
  const { pathname } = url.parse(req.url);
  const uuidPatNameRegex = /\/api\/users\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/;

  if (pathname !== '/api/users' && !uuidPatNameRegex.test(pathname)) {
    errorHandler(res, 404);
  }

  if (uuidPatNameRegex.test(pathname)) {
    try {
      const id = req.url.split("/")[3];
      const user = await UsersService.findOne(id);

      res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
      res.end(JSON.stringify(user));
    } catch (error) {
      res.writeHead(404, { 'Content-Type': 'application/json;charset=utf-8' });

      res.end(JSON.stringify({ message: error }));
    }
  }

  if (pathname === '/api/users') {
    const users = await UsersService.findAll();

    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
    res.end(JSON.stringify(users));
  }
}

async function postRequestHandler(req, res) {
  const { pathname } = url.parse(req.url);

  if (pathname !== '/api/users') {
    errorHandler(res, 404);
  }

  const userPayload = await getReqData(req);
  const user = await UsersService.create(JSON.parse(userPayload));

  res.writeHead(201, { 'Content-Type': 'application/json;charset=utf-8' });
  res.end(JSON.stringify(user));
}

async function putRequestHandler(req, res) {
  const { pathname } = url.parse(req.url);
  const uuidPatNameRegex = /\/api\/users\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/;

  if (!uuidPatNameRegex.test(pathname)) {
    errorHandler(res, 404);
  }

  const id = req.url.split("/")[3];
  const userPayload = await getReqData(req);
  const user = await UsersService.update(id, JSON.parse(userPayload));

  res.writeHead(201, { 'Content-Type': 'application/json;charset=utf-8' });
  res.end(JSON.stringify(user));
}

async function deleteRequestHandler(req, res) {
  const { pathname } = url.parse(req.url);
  const uuidPatNameRegex = /\/api\/users\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/;

  if (!uuidPatNameRegex.test(pathname)) {
    errorHandler(res, 404);
  }

  const id = req.url.split("/")[3];
  const user = await UsersService.delete(id);

  res.writeHead(201, { 'Content-Type': 'application/json;charset=utf-8' });
  res.end(JSON.stringify(user));
}