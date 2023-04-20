import { IncomingMessage, ServerResponse } from "http";
import UsersController from "@users/users.controller";
import UsersService from "@users/users.service";
import { getReqData } from "@common/main";
import { ObjectId } from "mongodb";
import { Subject } from "rxjs";

const MOCK_USER_ID = "65a06b9b-72ee-4cd7-9227-3934d3c8e02b";
const MOCK_USER = {
  _id: new ObjectId("12343285f3d7aa7ec847c284"),
  id: MOCK_USER_ID,
  fullname: "TestFirstName1 TestLastName1",
  email: "testemail1@example.com",
  password: "12345678",
  createdAt: "2000-01-01T12:00:00.000Z",
  updatedAt: "2000-01-01T12:00:00.000Z",
};
const MOCK_USER_PAYLOAD = {
  fullname: "TestFirstName1 TestLastName1",
  email: "testemail1@example.com",
  password: "12345678",
};

describe("UsersController", () => {
  let usersController: UsersController;
  let mockUsersService: UsersService;
  let mockReq: IncomingMessage;
  let mockRes: ServerResponse;

  beforeEach(() => {
    mockUsersService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
    } as any;

    usersController = new UsersController();
    usersController["usersService"] = mockUsersService;

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
        const mockUsers = [MOCK_USER];
        jest
          .spyOn(mockUsersService, "findAll")
          .mockResolvedValue(mockUsers as any);

        mockReq.method = "GET";
        mockReq.url = "/api/users";

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
        mockReq.url = `/api/users/${MOCK_USER_ID}`;

        await usersController.requestHandler(mockReq, mockRes);

        expect(mockRes.writeHead).toHaveBeenCalledWith(200, {
          "Content-Type": "application/json;charset=utf-8",
        });
        expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify(MOCK_USER));
      });
    });
  });

  // describe("postRequestHandler", () => {
  //   it("should create an users on POST /api/users", async () => {
  //     jest
  //       .spyOn(mockUsersService, "create")
  //       .mockResolvedValue(`successfully created a new user with id ${MOCK_USER_ID}`);

  //     mockReq.method = "POST";
  //     mockReq.url = "/api/users";

  //     await usersController.requestHandler(mockReq, mockRes);
  //   })
  // });
});
