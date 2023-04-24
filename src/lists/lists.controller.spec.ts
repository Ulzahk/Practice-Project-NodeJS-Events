import { IncomingMessage, ServerResponse } from "http";
import { MOCK_LIST, MOCK_LIST_PAYLOAD, MOCK_UUID } from "@mocks/main";
import { LISTS_URL_PATHNAME } from "@common/values";
import ListsController from "@lists/lists.controller";
import ListsService from "@lists/lists.service";
import JWTAuthenticationService from "@authentication/authentication.service";

describe("ListsController", () => {
  let listsController: ListsController;
  let mockListService: ListsService;
  let mockReq: IncomingMessage;
  let mockRes: ServerResponse;
  let mockJwtAuthenticationService: JWTAuthenticationService;

  beforeEach(() => {
    mockListService = {
      findAll: jest.fn(),
      findAllByUserId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockJwtAuthenticationService = {
      verifyToken: jest.fn(),
    } as any;

    listsController = new ListsController();
    listsController["listsService"] = mockListService;
    listsController["jwtAuthenticationService"] = mockJwtAuthenticationService;

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
      it("should return all lists on GET /api/lists", async () => {
        const mockLists = [MOCK_LIST] as any;
        jest.spyOn(mockListService, "findAll").mockResolvedValue(mockLists);

        mockReq.method = "GET";
        mockReq.url = LISTS_URL_PATHNAME;

        await listsController.requestHandler(mockReq, mockRes);

        expect(mockRes.writeHead).toHaveBeenCalledWith(200, {
          "Content-Type": "application/json;charset=utf-8",
        });
        expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify(mockLists));
      });

      it("should return lists by userId on GET /api/lists/user/:id", async () => {
        jest
          .spyOn(mockListService, "findAllByUserId")
          .mockResolvedValue(MOCK_LIST as any);

        mockReq.method = "GET";
        mockReq.url = `${LISTS_URL_PATHNAME}/user/${MOCK_UUID}`;

        await listsController.requestHandler(mockReq, mockRes);

        expect(mockRes.writeHead).toHaveBeenCalledWith(200, {
          "Content-Type": "application/json;charset=utf-8",
        });
        expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify(MOCK_LIST));
      });
    });

    describe("postRequestHandler", () => {
      it("should create an list on POST /api/lists", async () => {
        jest
          .spyOn(mockListService, "create")
          .mockResolvedValue(
            `successfully created a new list with id ${MOCK_UUID}`
          );

        mockReq.method = "POST";
        mockReq.url = LISTS_URL_PATHNAME;
        mockReq.on = jest.fn().mockImplementation((event, callback) => {
          if (event === "data") {
            callback(JSON.stringify(MOCK_LIST_PAYLOAD));
          } else if (event === "end") {
            callback();
          }
        });

        await listsController.requestHandler(mockReq, mockRes);

        expect(listsController["listsService"].create).toHaveBeenCalledTimes(1);
        expect(listsController["listsService"].create).toHaveBeenCalledWith(
          MOCK_LIST_PAYLOAD
        );
      });
    });

    describe("putRequestHandler", () => {
      it("should update a list on PUT /api/lists/:id", async () => {
        jest
          .spyOn(mockListService, "update")
          .mockResolvedValue(MOCK_LIST as any);

        mockReq.method = "PUT";
        mockReq.url = `${LISTS_URL_PATHNAME}/${MOCK_UUID}`;
        mockReq.on = jest.fn().mockImplementation((event, callback) => {
          if (event === "data") {
            callback(JSON.stringify(MOCK_LIST_PAYLOAD));
          } else if (event === "end") {
            callback();
          }
        });

        await listsController.requestHandler(mockReq, mockRes);

        expect(listsController["listsService"].update).toHaveBeenCalledTimes(1);
        expect(listsController["listsService"].update).toHaveBeenCalledWith(
          MOCK_UUID,
          MOCK_LIST_PAYLOAD
        );
      });
    });

    describe("deleteRequestHandler", () => {
      it("should delete a list on DELETE /api/lists/:id", async () => {
        jest.spyOn(mockListService, "delete").mockResolvedValue({
          acknowledged: true,
          deletedCount: 1,
        });

        mockReq.method = "DELETE";
        mockReq.url = `${LISTS_URL_PATHNAME}/${MOCK_UUID}`;

        await listsController.requestHandler(mockReq, mockRes);

        expect(listsController["listsService"].delete).toHaveBeenCalledTimes(1);
        expect(listsController["listsService"].delete).toHaveBeenCalledWith(
          MOCK_UUID
        );
      });
    });
  });
});
