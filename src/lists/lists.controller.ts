import { IncomingMessage, ServerResponse } from "http";
import { ListsSubjectResponse } from "@lists/lists.dto";
import { Subject } from "rxjs";
import { ICommonRequestHandler, IErrorHandler } from "@common/interfaces";
import { errorHandler, getReqData } from "@common/functions";
import {
  LISTS_URL_PATHNAME,
  UUID_LISTS_BY_USER_PATH_NAME_REGEX,
  UUID_LISTS_PATH_NAME_REGEX,
} from "@common/values";
import ListsService from "@lists/lists.service";
import url from "url";

class ListsController {
  private listsService;
  private listsDataStore;
  private listsErrorStore;

  constructor() {
    this.listsService = new ListsService();
    this.listsDataStore = new Subject();
    this.listsErrorStore = new Subject();
  }

  async requestHandler(req: IncomingMessage, res: ServerResponse) {
    const { pathname } = url.parse(req.url!);

    this.listsDataStore.subscribe({
      next: async (listsSubjectResponse) => {
        const { item, code } = listsSubjectResponse as ListsSubjectResponse;
        res.writeHead(code, {
          "Content-Type": "application/json;charset=utf-8",
        });
        res.end(JSON.stringify(item));
      },
    });

    this.listsErrorStore.subscribe({
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

    return this.listsErrorStore.next("bad request");
  }

  async getRequestHandler({ req, pathname }: ICommonRequestHandler) {
    if (
      pathname !== LISTS_URL_PATHNAME &&
      !UUID_LISTS_BY_USER_PATH_NAME_REGEX.test(pathname)
    ) {
      this.listsErrorStore.next("invalid input");
    }

    if (UUID_LISTS_BY_USER_PATH_NAME_REGEX.test(pathname)) {
      try {
        const id = req.url?.split("/")[4];
        const user = await this.listsService.findAllByUserId(id!);
        this.listsDataStore.next({
          item: user,
          code: 200,
        });
      } catch (error) {
        this.listsErrorStore.next(error);
      }
    }

    if (pathname === LISTS_URL_PATHNAME) {
      try {
        const lists = await this.listsService.findAll();
        this.listsDataStore.next({
          item: lists,
          code: 200,
        });
      } catch (error) {
        this.listsErrorStore.next(error);
      }
    }
  }

  async postRequestHandler({ req, pathname }: ICommonRequestHandler) {
    if (pathname !== LISTS_URL_PATHNAME) {
      this.listsErrorStore.next("invalid input");
    }

    try {
      const payload = await getReqData(req);
      const list = await this.listsService.create(JSON.parse(payload));
      this.listsDataStore.next({
        item: list,
        code: 201,
      });
    } catch (error) {
      this.listsErrorStore.next(error);
    }
  }

  async putRequestHandler({ req, pathname }: ICommonRequestHandler) {
    if (!UUID_LISTS_PATH_NAME_REGEX.test(pathname)) {
      this.listsErrorStore.next("invalid input");
    }

    try {
      const id = req.url?.split("/")[3];
      const payload = await getReqData(req);
      const list = await this.listsService.update(id!, JSON.parse(payload));

      this.listsDataStore.next({
        item: list,
        code: 200,
      });
    } catch (error) {
      this.listsErrorStore.next(error);
    }
  }

  async deleteRequestHandler({ req, pathname }: ICommonRequestHandler) {
    if (!UUID_LISTS_PATH_NAME_REGEX.test(pathname)) {
      this.listsErrorStore.next("invalid input");
    }

    try {
      const id = req.url?.split("/")[3];
      const list = await this.listsService.delete(id!);

      this.listsDataStore.next({
        item: list,
        code: 200,
      });
    } catch (error) {
      this.listsErrorStore.next(error);
    }
  }
}

export default ListsController;
