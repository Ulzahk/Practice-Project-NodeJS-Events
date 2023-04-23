import url from "url";
import { IncomingMessage, ServerResponse } from "http";
import { errorHandler, getReqData } from "@common/functions";
import { UsersSubjectResponse } from "@users/users.dto";
import { ICommonRequestHandler, IErrorHandler } from "@common/interfaces";
import { Subject } from "rxjs";
import UsersService from "@users/users.service";
import { USERS_URL_PATHNAME, UUID_USERS_PATH_NAME_REGEX } from "@common/values";

class UsersController {
  private usersService;
  private usersDataStore;
  private usersErrorStore;

  constructor() {
    this.usersService = new UsersService();
    this.usersDataStore = new Subject();
    this.usersErrorStore = new Subject();
  }

  async requestHandler(req: IncomingMessage, res: ServerResponse) {
    const { pathname } = url.parse(req.url!);

    this.usersDataStore.subscribe({
      next: async (usersSubjectResponse) => {
        const { item, code } = usersSubjectResponse as UsersSubjectResponse;
        res.writeHead(code, {
          "Content-Type": "application/json;charset=utf-8",
        });
        res.end(JSON.stringify(item));
      },
    });

    this.usersErrorStore.subscribe({
      next: (error) =>
        errorHandler({ res, code: 400, errorMessage: error } as IErrorHandler),
    });

    if (req.method === "GET")
      return await this.getRequestHandler({
        req,
        res,
        pathname: pathname as string,
      });
    if (req.method === "POST")
      return await this.postRequestHandler({
        req,
        res,
        pathname: pathname as string,
      });
    if (req.method === "PUT")
      return await this.putRequestHandler({
        req,
        res,
        pathname: pathname as string,
      });
    if (req.method === "DELETE")
      return await this.deleteRequestHandler({
        req,
        res,
        pathname: pathname as string,
      });

    return this.usersErrorStore.next("bad request");
  }

  async getRequestHandler({ req, pathname }: ICommonRequestHandler) {
    if (
      pathname !== USERS_URL_PATHNAME &&
      !UUID_USERS_PATH_NAME_REGEX.test(pathname)
    ) {
      this.usersErrorStore.next("invalid input");
    }

    if (UUID_USERS_PATH_NAME_REGEX.test(pathname)) {
      try {
        const id = req.url?.split("/")[3];
        const user = await this.usersService.findOne(id!);
        this.usersDataStore.next({
          item: user,
          code: 200,
        });
      } catch (error) {
        this.usersErrorStore.next(error);
      }
    }

    if (pathname === USERS_URL_PATHNAME) {
      try {
        const users = await this.usersService.findAll();
        this.usersDataStore.next({
          item: users,
          code: 200,
        });
      } catch (error) {
        this.usersErrorStore.next(error);
      }
    }
  }

  async postRequestHandler({ req, pathname }: ICommonRequestHandler) {
    if (pathname !== USERS_URL_PATHNAME) {
      this.usersErrorStore.next("invalid input");
    }

    try {
      const payload = await getReqData(req);
      const user = await this.usersService.create(JSON.parse(payload));
      this.usersDataStore.next({
        item: user,
        code: 201,
      });
    } catch (error) {
      this.usersErrorStore.next(error);
    }
  }

  async putRequestHandler({ req, pathname }: ICommonRequestHandler) {
    if (!UUID_USERS_PATH_NAME_REGEX.test(pathname)) {
      this.usersErrorStore.next("invalid input");
    }

    try {
      const id = req.url?.split("/")[3];
      const payload = await getReqData(req);
      const user = await this.usersService.update(id!, JSON.parse(payload));

      this.usersDataStore.next({
        item: user,
        code: 200,
      });
    } catch (error) {
      this.usersErrorStore.next(error);
    }
  }

  async deleteRequestHandler({ req, pathname }: ICommonRequestHandler) {
    if (!UUID_USERS_PATH_NAME_REGEX.test(pathname)) {
      this.usersErrorStore.next("invalid input");
    }

    try {
      const id = req.url?.split("/")[3];
      const user = await this.usersService.delete(id!);

      this.usersDataStore.next({
        item: user,
        code: 200,
      });
    } catch (error) {
      this.usersErrorStore.next(error);
    }
  }
}

export default UsersController;
