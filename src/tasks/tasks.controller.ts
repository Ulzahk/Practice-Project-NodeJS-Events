import {
  TASKS_URL_PATHNAME,
  UUID_TASKS_BY_LIST_PATH_NAME_REGEX,
  UUID_TASKS_PATH_NAME_REGEX,
} from "@common/values";
import { IncomingMessage, ServerResponse } from "http";
import { ICommonRequestHandler, IErrorHandler } from "@common/interfaces";
import { errorHandler, getReqData } from "@common/functions";
import { TasksSubjectResponse } from "@tasks/tasks.dto";
import { Subject } from "rxjs";
import { Role } from "@users/users.model";
import TasksService from "@tasks/tasks.service";
import url from "url";
import JWTAuthenticationService from "@authentication/authentication.service";

class TasksController {
  private tasksService;
  private tasksDataStore;
  private tasksErrorStore;
  private jwtAuthenticationService;

  constructor() {
    this.tasksService = new TasksService();
    this.tasksDataStore = new Subject();
    this.tasksErrorStore = new Subject();
    this.jwtAuthenticationService = new JWTAuthenticationService();
  }

  async requestHandler(req: IncomingMessage, res: ServerResponse) {
    const { pathname } = url.parse(req.url!);

    this.tasksDataStore.subscribe({
      next: async (tasksSubjectResponse) => {
        const { item, code } = tasksSubjectResponse as TasksSubjectResponse;
        res.writeHead(code, {
          "Content-Type": "application/json;charset=utf-8",
        });
        res.end(JSON.stringify(item));
      },
    });

    this.tasksErrorStore.subscribe({
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

    return this.tasksErrorStore.next("bad request");
  }

  async getRequestHandler({ req, pathname }: ICommonRequestHandler) {
    if (
      pathname !== TASKS_URL_PATHNAME &&
      !UUID_TASKS_BY_LIST_PATH_NAME_REGEX.test(pathname)
    ) {
      this.tasksErrorStore.next("invalid input");
    }

    if (UUID_TASKS_BY_LIST_PATH_NAME_REGEX.test(pathname)) {
      try {
        const roles = [Role.admin, Role.user];
        this.jwtAuthenticationService.verifyToken(req, roles);
        const id = req.url?.split("/")[4];
        const tasks = await this.tasksService.findAllByListId(id!);
        this.tasksDataStore.next({
          item: tasks,
          code: 200,
        });
      } catch (error) {
        this.tasksErrorStore.next(error);
      }
    }

    if (pathname === TASKS_URL_PATHNAME) {
      try {
        const roles = [Role.admin, Role.user];
        this.jwtAuthenticationService.verifyToken(req, roles);
        const tasks = await this.tasksService.findAll();
        this.tasksDataStore.next({
          item: tasks,
          code: 200,
        });
      } catch (error) {
        this.tasksErrorStore.next(error);
      }
    }
  }

  async postRequestHandler({ req, pathname }: ICommonRequestHandler) {
    if (pathname !== TASKS_URL_PATHNAME) {
      this.tasksErrorStore.next("invalid input");
    }

    try {
      const roles = [Role.admin, Role.user];
      this.jwtAuthenticationService.verifyToken(req, roles);
      const payload = await getReqData(req);
      const task = await this.tasksService.create(JSON.parse(payload));
      this.tasksDataStore.next({
        item: task,
        code: 201,
      });
    } catch (error) {
      this.tasksErrorStore.next(error);
    }
  }

  async putRequestHandler({ req, pathname }: ICommonRequestHandler) {
    if (!UUID_TASKS_PATH_NAME_REGEX.test(pathname)) {
      this.tasksDataStore.next("invalid input");
    }

    try {
      const roles = [Role.admin, Role.user];
      this.jwtAuthenticationService.verifyToken(req, roles);
      const id = req.url?.split("/")[3];
      const payload = await getReqData(req);
      const task = await this.tasksService.update(id!, JSON.parse(payload));

      this.tasksDataStore.next({
        item: task,
        code: 200,
      });
    } catch (error) {
      this.tasksErrorStore.next(error);
    }
  }

  async deleteRequestHandler({ req, pathname }: ICommonRequestHandler) {
    if (!UUID_TASKS_PATH_NAME_REGEX.test(pathname)) {
      this.tasksErrorStore.next("invalid input");
    }

    try {
      const roles = [Role.admin, Role.user];
      this.jwtAuthenticationService.verifyToken(req, roles);
      const id = req.url?.split("/")[3];
      const task = await this.tasksService.delete(id!);

      this.tasksDataStore.next({
        item: task,
        code: 200,
      });
    } catch (error) {
      this.tasksErrorStore.next(error);
    }
  }
}

export default TasksController;
