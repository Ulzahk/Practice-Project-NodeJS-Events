'use strict';
const url = require('url');
const { errorHandler, getReqData } = require('../common');
const UsersService = require('./users.service');
const UsersSubject = require('./users.subject');

class UsersController {
  constructor() { }

  async requestHandler(req, res) {
    const { pathname } = url.parse(req.url);

    UsersSubject.subscribe({
      next: async ({
        item,
        code,
      }) => {
        res.writeHead(code, { 'Content-Type': 'application/json;charset=utf-8' });
        res.end(JSON.stringify(item));
      },
      error: (error) => errorHandler({ res, code: 400, errorMessage: error }),
    });

    if (req.method === 'GET') {
      return await this.getRequestHandler({ req, res, pathname });
    }
    if (req.method === 'POST') {
      return await this.postRequestHandler({ req, res, pathname });
    }
    if (req.method === 'PUT') {
      return await this.putRequestHandler({ req, res, pathname });
    }
    if (req.method === 'DELETE') {
      return await this.deleteRequestHandler({ req, res, pathname });
    }

    return errorHandler({ res, code: 404 });
  }

  async getRequestHandler({ req, res, pathname }) {
    const uuidPatNameRegex = /\/api\/users\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/;

    if (pathname !== '/api/users' && !uuidPatNameRegex.test(pathname)) {
      errorHandler({ res, code: 404 });
    }

    if (uuidPatNameRegex.test(pathname)) {
      try {
        const id = req.url.split("/")[3];
        const user = await UsersService.findOne(id);
        UsersSubject.next({
          item: user,
          code: 200
        });
      } catch (error) {
        UsersSubject.error(error);
      }
    }

    if (pathname === '/api/users') {
      try {
        const users = await UsersService.findAll();
        UsersSubject.next({
          item: users,
          code: 200
        });
      } catch (error) {
        UsersSubject.error(error);
      }
    }
  }

  async postRequestHandler({ req, res, pathname }) {
    if (pathname !== '/api/users') {
      errorHandler({ res, code: 404 });
    }

    try {
      const userPayload = await getReqData(req);
      const user = await UsersService.create(JSON.parse(userPayload));
      UsersSubject.next({
        item: user,
        code: 201
      });
    } catch (error) {
      UsersSubject.error(error);
    }
  }

  async putRequestHandler({ req, res, pathname }) {
    const uuidPatNameRegex = /\/api\/users\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/;

    if (!uuidPatNameRegex.test(pathname)) {
      errorHandler(res, 404);
    }

    try {
      const id = req.url.split("/")[3];
      const userPayload = await getReqData(req);
      const user = await UsersService.update(id, JSON.parse(userPayload));

      UsersSubject.next({
        item: user,
        code: 200,
      });
    } catch (error) {
      UsersSubject.next(error);
    }
  }

  async deleteRequestHandler({ req, res, pathname }) {
    const uuidPatNameRegex = /\/api\/users\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/;

    if (!uuidPatNameRegex.test(pathname)) {
      errorHandler(res, 404);
    }

    try {
      const id = req.url.split("/")[3];
      const user = await UsersService.delete(id);

      UsersSubject.next({
        item: user,
        code: 200,
      });
    } catch (error) {
      UsersSubject.next(error);
    }
  }
}

module.exports = new UsersController();

