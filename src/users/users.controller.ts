import url from 'url';
import { IncomingMessage, ServerResponse } from "http";
import { errorHandler, getReqData } from '@common/main';
import { UsersSubjectResponse } from '@users/users.dto';
import { ICommonHandler } from '@common/interfaces';
import { connectToDatabase } from '@database/database.service';
import UsersService from '@users/users.service';
import UsersSubject from '@users/users.subject';

class UsersController {
  constructor() { }

  async requestHandler(req: IncomingMessage, res: ServerResponse) {
    const { pathname } = url.parse(req.url!);

    await connectToDatabase();

    UsersSubject.subscribe({
      next: async (usersSubjectResponse) => {
        const { item, code } = usersSubjectResponse as UsersSubjectResponse;
        res.writeHead(code, { 'Content-Type': 'application/json;charset=utf-8' });
        res.end(JSON.stringify(item));
      },
      error: (error) => errorHandler({ res, code: 400, errorMessage: error }),
    });

    if (req.method === 'GET') {
      return await this.getRequestHandler({ req, res, pathname: pathname as string });
    }
    if (req.method === 'POST') {
      return await this.postRequestHandler({ req, res, pathname: pathname as string });
    }
    if (req.method === 'PUT') {
      return await this.putRequestHandler({ req, res, pathname: pathname as string });
    }
    if (req.method === 'DELETE') {
      return await this.deleteRequestHandler({ req, res, pathname: pathname as string });
    }

    return UsersSubject.error('bad request');
  }

  async getRequestHandler({ req, pathname }: ICommonHandler) {
    const uuidPatNameRegex = /\/api\/users\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/;

    if (pathname !== '/api/users' && !uuidPatNameRegex.test(pathname)) {
      UsersSubject.error('invalid input');
    }

    if (uuidPatNameRegex.test(pathname)) {
      try {
        const id = req.url?.split("/")[3];
        const user = await UsersService.findOne(id!);
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

  async postRequestHandler({ req, res, pathname }: ICommonHandler) {
    if (pathname !== '/api/users') {
      UsersSubject.error('invalid input');
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

  async putRequestHandler({ req, res, pathname }: ICommonHandler) {
    const uuidPatNameRegex = /\/api\/users\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/;

    if (!uuidPatNameRegex.test(pathname)) {
      UsersSubject.error('invalid input');
    }

    try {
      const id = req.url?.split("/")[3];
      const userPayload = await getReqData(req);
      const user = await UsersService.update(id!, JSON.parse(userPayload));

      UsersSubject.next({
        item: user,
        code: 200,
      });
    } catch (error) {
      UsersSubject.error(error);
    }
  }

  async deleteRequestHandler({ req, res, pathname }: ICommonHandler) {
    const uuidPatNameRegex = /\/api\/users\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/;

    if (!uuidPatNameRegex.test(pathname)) {
      UsersSubject.error('invalid input');
    }

    try {
      const id = req.url?.split("/")[3];
      const user = await UsersService.delete(id!);

      UsersSubject.next({
        item: user,
        code: 200,
      });
    } catch (error) {
      UsersSubject.error(error);
    }
  }
}

export default new UsersController();

