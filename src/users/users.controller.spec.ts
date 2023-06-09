import { IncomingMessage, ServerResponse } from "http";
import {
  MOCK_UUID,
  MOCK_USER,
  MOCK_USER_PAYLOAD,
  MOCK_TOKEN_DATA,
} from "@mocks/main";
import { USERS_URL_PATHNAME } from "@common/values";
import UsersController from "@users/users.controller";
import UsersService from "@users/users.service";
import JWTAuthenticationService from "@authentication/authentication.service";

describe("UsersController", () => {
  let usersController: UsersController;
  let mockUsersService: UsersService;
  let mockReq: IncomingMessage;
  let mockRes: ServerResponse;
  let mockJwtAuthenticationService: JWTAuthenticationService;

  beforeEach(() => {
    mockUsersService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockJwtAuthenticationService = {
      verifyToken: jest.fn(),
    } as any;

    usersController = new UsersController();
    usersController["usersService"] = mockUsersService;
    usersController["jwtAuthenticationService"] = mockJwtAuthenticationService;

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
      it("should return all users on GET /api/users", async () => {
        const mockUsers = [MOCK_USER] as any;
        jest.spyOn(mockUsersService, "findAll").mockResolvedValue(mockUsers);

        mockReq.method = "GET";
        mockReq.url = USERS_URL_PATHNAME;

        await usersController.requestHandler(mockReq, mockRes);

        expect(mockRes.writeHead).toHaveBeenCalledWith(200, {
          "Content-Type": "application/json;charset=utf-8",
        });
        expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify(mockUsers));
      });

      it("should return an user on GET /api/users/:id", async () => {
        jest
          .spyOn(mockUsersService, "findOne")
          .mockResolvedValue(MOCK_USER as any);
        mockReq.method = "GET";
        mockReq.url = `/api/users/${MOCK_UUID}`;

        await usersController.requestHandler(mockReq, mockRes);

        expect(mockRes.writeHead).toHaveBeenCalledWith(200, {
          "Content-Type": "application/json;charset=utf-8",
        });
        expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify(MOCK_USER));
      });
    });

    describe("postRequestHandler", () => {
      it("should create an user on POST /api/users", async () => {
        jest
          .spyOn(mockUsersService, "create")
          .mockResolvedValue(
            `successfully created a new user with id ${MOCK_UUID}`
          );

        mockReq.method = "POST";
        mockReq.url = USERS_URL_PATHNAME;
        mockReq.on = jest.fn().mockImplementation((event, callback) => {
          if (event === "data") {
            callback(JSON.stringify(MOCK_USER_PAYLOAD));
          } else if (event === "end") {
            callback();
          }
        });

        await usersController.requestHandler(mockReq, mockRes);

        expect(usersController["usersService"].create).toHaveBeenCalledTimes(1);
        expect(usersController["usersService"].create).toHaveBeenCalledWith(
          MOCK_USER_PAYLOAD
        );
      });
    });

    describe("putRequestHandler", () => {
      it("should update an users on PUT /api/users/:id", async () => {
        jest.spyOn(mockUsersService, "update").mockResolvedValue(MOCK_USER);

        mockReq.method = "PUT";
        mockReq.url = `${USERS_URL_PATHNAME}/${MOCK_UUID}`;
        mockReq.on = jest.fn().mockImplementation((event, callback) => {
          if (event === "data") {
            callback(JSON.stringify(MOCK_USER_PAYLOAD));
          } else if (event === "end") {
            callback();
          }
        });

        await usersController.requestHandler(mockReq, mockRes);

        expect(usersController["usersService"].update).toHaveBeenCalledTimes(1);
        expect(usersController["usersService"].update).toHaveBeenCalledWith(
          MOCK_UUID,
          MOCK_USER_PAYLOAD
        );
      });
    });

    describe("deleteRequestHandler", () => {
      it("should delete an user on DELETE /api/users/:id", async () => {
        jest.spyOn(mockUsersService, "delete").mockResolvedValue({
          acknowledged: true,
          deletedCount: 1,
        });

        mockReq.method = "DELETE";
        mockReq.url = `${USERS_URL_PATHNAME}/${MOCK_UUID}`;

        await usersController.requestHandler(mockReq, mockRes);

        expect(usersController["usersService"].delete).toHaveBeenCalledTimes(1);
        expect(usersController["usersService"].delete).toHaveBeenCalledWith(
          MOCK_UUID
        );
      });
    });
  });
});
