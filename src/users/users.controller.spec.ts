import UsersController from "@users/users.controller";
import UsersService from "@users/users.service";
import { ObjectId } from 'mongodb';
import request from "supertest";

jest.mock('@users/users.service');

const MOCK_USER = {
  _id: new ObjectId("12343285f3d7aa7ec847c284"),
  id: '65a06b9b-72ee-4cd7-9227-3934d3c8e02b',
  fullname: "TestFirstName1 TestLastName1",
  email: "testemail1@example.com",
  password: "12345678",
  createdAt: "2000-01-01T12:00:00.000Z",
  updatedAt: "2000-01-01T12:00:00.000Z",
};

describe("Users Controller", () => {
  let mockUsersService: typeof UsersService;
  beforeEach(() => { })

  it("should return a list of users", () => {
    jest
      .spyOn(mockUsersService, "findAll")
      .mockResolvedValue([MOCK_USER, MOCK_USER, MOCK_USER])

    const result = UsersController.getRequestHandler({
      req: request,
      pathname: "/api/users"
    } as any);

    const expected = [
      MOCK_USER,
      MOCK_USER,
      MOCK_USER
    ];

    expect(result).toBe(expected);
  })
})