import {
  TOKEN_EXPIRATION_TIME,
  USERS_AUTH_URL_PATHNAME,
  USERS_URL_PATHNAME,
  UUID_USERS_PATH_NAME_REGEX,
} from "@common/values";
import { IncomingMessage, ServerResponse } from "http";
import {
  errorHandler,
  getExpirationTimeUnixFormat,
  getReqData,
} from "@common/functions";
import { UsersSubjectResponse } from "@users/users.dto";
import { Role } from "@users/users.model";
import { ICommonRequestHandler, IErrorHandler } from "@common/interfaces";
import { Subject } from "rxjs";
import UsersService from "@users/users.service";
import url from "url";
import bcrypt from "bcrypt";
import JWTAuthenticationService from "@authentication/authentication.service";

class UsersController {
  private usersService;
  private usersDataStore;
  private usersErrorStore;
  private jwtAuthenticationService;

  constructor() {
    this.usersService = new UsersService();
    this.usersDataStore = new Subject();
    this.usersErrorStore = new Subject();
    this.jwtAuthenticationService = new JWTAuthenticationService();
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
        const roles = [Role.admin, Role.user];
        this.jwtAuthenticationService.verifyToken(req, roles);
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
        const roles = [Role.admin, Role.user];
        this.jwtAuthenticationService.verifyToken(req, roles);
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
    if (
      pathname !== USERS_URL_PATHNAME &&
      pathname !== USERS_AUTH_URL_PATHNAME
    ) {
      this.usersErrorStore.next("invalid input");
    }

    if (pathname === USERS_URL_PATHNAME) {
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

    if (pathname === USERS_AUTH_URL_PATHNAME) {
      try {
        const payload = await getReqData(req);
        const { email, password } = JSON.parse(payload);

        if (!email || !password) throw "Invalid information";

        const user = await this.usersService.findOneByEmail(email);
        const comparedPassword = await bcrypt.compare(password, user.password);

        if (!comparedPassword) throw "Invalid information";

        const token = this.jwtAuthenticationService.jwtIssuer(
          { userId: user.id, role: user.role },
          TOKEN_EXPIRATION_TIME
        );

        this.usersDataStore.next({
          item: {
            userId: user.id,
            role: user.role,
            token,
            expirationTime: getExpirationTimeUnixFormat(),
          },
          code: 201,
        });
      } catch (error) {
        this.usersErrorStore.next(error);
      }
    }
  }

  async putRequestHandler({ req, pathname }: ICommonRequestHandler) {
    if (!UUID_USERS_PATH_NAME_REGEX.test(pathname)) {
      this.usersErrorStore.next("invalid input");
    }

    try {
      const roles = [Role.admin, Role.user];
      this.jwtAuthenticationService.verifyToken(req, roles);
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
      const roles = [Role.admin];
      this.jwtAuthenticationService.verifyToken(req, roles);
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
