import url from 'url';
import { IncomingMessage, ServerResponse } from "http";
import { errorHandler, getReqData } from '@common/main';
import { UsersSubjectResponse } from '@users/users.dto';
import { ICommonRequestHandler, IErrorHandler } from '@common/interfaces';
import { connectToDatabase } from '@database/database.service';
import { UsersDataStore, UsersErrorStore } from '@users/users.store';
import UsersService from '@users/users.service';

class UsersController {
  constructor() { }

  async requestHandler(req: IncomingMessage, res: ServerResponse) {
    const { pathname } = url.parse(req.url!);

    await connectToDatabase();

    UsersDataStore.subscribe({
      next: async (usersSubjectResponse) => {
        const { item, code } = usersSubjectResponse as UsersSubjectResponse;
        res.writeHead(code, { 'Content-Type': 'application/json;charset=utf-8' });
        res.end(JSON.stringify(item));
      },
    });

    UsersErrorStore.subscribe({
      next: (error) => errorHandler({ res, code: 400, errorMessage: error } as IErrorHandler),
    });

    if (req.method === 'GET') return await this.getRequestHandler({ req, res, pathname: pathname as string });
    if (req.method === 'POST') return await this.postRequestHandler({ req, res, pathname: pathname as string });
    if (req.method === 'PUT') return await this.putRequestHandler({ req, res, pathname: pathname as string });
    if (req.method === 'DELETE') return await this.deleteRequestHandler({ req, res, pathname: pathname as string });

    return UsersErrorStore.next('bad request');
  }

  async getRequestHandler({ req, pathname }: ICommonRequestHandler) {
    const uuidPatNameRegex = /\/api\/users\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/;

    if (pathname !== '/api/users' && !uuidPatNameRegex.test(pathname)) {
      UsersErrorStore.next('invalid input');
    }

    if (uuidPatNameRegex.test(pathname)) {
      try {
        const id = req.url?.split("/")[3];
        const user = await UsersService.findOne(id!);
        UsersDataStore.next({
          item: user,
          code: 200
        });
      } catch (error) {
        UsersErrorStore.next(error);
      }
    }

    if (pathname === '/api/users') {
      try {
        const users = await UsersService.findAll();
        UsersDataStore.next({
          item: users,
          code: 200
        });
      } catch (error) {
        UsersErrorStore.next(error);
      }
    }
  }

  async postRequestHandler({ req, pathname }: ICommonRequestHandler) {
    if (pathname !== '/api/users') {
      UsersErrorStore.next('invalid input');
    }

    try {
      const userPayload = await getReqData(req);
      const user = await UsersService.create(JSON.parse(userPayload));
      UsersDataStore.next({
        item: user,
        code: 201
      });
    } catch (error) {
      UsersErrorStore.next(error);
    }
  }

  async putRequestHandler({ req, pathname }: ICommonRequestHandler) {
    const uuidPatNameRegex = /\/api\/users\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/;

    if (!uuidPatNameRegex.test(pathname)) {
      UsersErrorStore.next('invalid input');
    }

    try {
      const id = req.url?.split("/")[3];
      const userPayload = await getReqData(req);
      const user = await UsersService.update(id!, JSON.parse(userPayload));

      UsersDataStore.next({
        item: user,
        code: 200,
      });
    } catch (error) {
      UsersErrorStore.next(error);
    }
  }

  async deleteRequestHandler({ req, pathname }: ICommonRequestHandler) {
    const uuidPatNameRegex = /\/api\/users\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/;

    if (!uuidPatNameRegex.test(pathname)) {
      UsersErrorStore.next('invalid input');
    }

    try {
      const id = req.url?.split("/")[3];
      const user = await UsersService.delete(id!);

      UsersDataStore.next({
        item: user,
        code: 200,
      });
    } catch (error) {
      UsersErrorStore.next(error);
    }
  }
}

export default new UsersController();

