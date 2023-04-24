import { IncomingMessage, ServerResponse } from "http";
import { MOCK_TASK, MOCK_TASK_PAYLOAD, MOCK_UUID } from "@mocks/main";
import { TASKS_URL_PATHNAME } from "@common/values";
import TasksController from "@tasks/tasks.controller";
import TasksService from "@tasks/tasks.service";
import JWTAuthenticationService from "@authentication/authentication.service";

describe("TasksController", () => {
  let tasksController: TasksController;
  let mockTasksService: TasksService;
  let mockReq: IncomingMessage;
  let mockRes: ServerResponse;
  let mockJwtAuthenticationService: JWTAuthenticationService;

  beforeEach(() => {
    mockTasksService = {
      findAll: jest.fn(),
      findAllByListId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockJwtAuthenticationService = {
      verifyToken: jest.fn(),
    } as any;

    tasksController = new TasksController();
    tasksController["tasksService"] = mockTasksService;
    tasksController["jwtAuthenticationService"] = mockJwtAuthenticationService;

    mockReq = {
      url: "",
      method: "",
    } as any;

    mockRes = {
      writeHead: jest.fn(),
      end: jest.fn(),
    } as any;
  });

  describe("requestHandler", () => {
    describe("getRequestHandler", () => {
      it("should return all tasks on GET /api/tasks", async () => {
        const mockLists = [MOCK_TASK] as any;
        jest.spyOn(mockTasksService, "findAll").mockResolvedValue(mockLists);

        mockReq.method = "GET";
        mockReq.url = TASKS_URL_PATHNAME;

        await tasksController.requestHandler(mockReq, mockRes);

        expect(mockRes.writeHead).toHaveBeenCalledWith(200, {
          "Content-Type": "application/json;charset=utf-8",
        });
        expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify(mockLists));
      });

      it("should return tasks by listId on GET /api/tasks/list/:id", async () => {
        jest
          .spyOn(mockTasksService, "findAllByListId")
          .mockResolvedValue(MOCK_TASK as any);

        mockReq.method = "GET";
        mockReq.url = `${TASKS_URL_PATHNAME}/list/${MOCK_UUID}`;

        await tasksController.requestHandler(mockReq, mockRes);

        expect(mockRes.writeHead).toHaveBeenCalledWith(200, {
          "Content-Type": "application/json;charset=utf-8",
        });
        expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify(MOCK_TASK));
      });
    });

    describe("postRequestHandler", () => {
      it("should create an task on POST /api/tasks", async () => {
        jest
          .spyOn(mockTasksService, "create")
          .mockResolvedValue(
            `successfully created a new task with id ${MOCK_UUID}`
          );

        mockReq.method = "POST";
        mockReq.url = TASKS_URL_PATHNAME;
        mockReq.on = jest.fn().mockImplementation((event, callback) => {
          if (event === "data") {
            callback(JSON.stringify(MOCK_TASK_PAYLOAD));
          } else if (event === "end") {
            callback();
          }
        });

        await tasksController.requestHandler(mockReq, mockRes);

        expect(tasksController["tasksService"].create).toHaveBeenCalledTimes(1);
        expect(tasksController["tasksService"].create).toHaveBeenCalledWith(
          MOCK_TASK_PAYLOAD
        );
      });
    });

    describe("putRequestHandler", () => {
      it("should update a task on PUT /api/tasks/:id", async () => {
        jest
          .spyOn(mockTasksService, "update")
          .mockResolvedValue(MOCK_TASK as any);

        mockReq.method = "PUT";
        mockReq.url = `${TASKS_URL_PATHNAME}/${MOCK_UUID}`;
        mockReq.on = jest.fn().mockImplementation((event, callback) => {
          if (event === "data") {
            callback(JSON.stringify(MOCK_TASK_PAYLOAD));
          } else if (event === "end") {
            callback();
          }
        });

        await tasksController.requestHandler(mockReq, mockRes);

        expect(tasksController["tasksService"].update).toHaveBeenCalledTimes(1);
        expect(tasksController["tasksService"].update).toHaveBeenCalledWith(
          MOCK_UUID,
          MOCK_TASK_PAYLOAD
        );
      });
    });

    describe("deleteRequestHandler", () => {
      it("should delete a task on DELETE /api/tasks/:id", async () => {
        jest.spyOn(mockTasksService, "delete").mockResolvedValue({
          acknowledged: true,
          deletedCount: 1,
        });

        mockReq.method = "DELETE";
        mockReq.url = `${TASKS_URL_PATHNAME}/${MOCK_UUID}`;

        await tasksController.requestHandler(mockReq, mockRes);

        expect(tasksController["tasksService"].delete).toHaveBeenCalledTimes(1);
        expect(tasksController["tasksService"].delete).toHaveBeenCalledWith(
          MOCK_UUID
        );
      });
    });
  });
});
