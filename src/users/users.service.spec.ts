import UsersService from "@users/users.service";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongodb";

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

jest.mock("uuid", () => ({
  v4: () => MOCK_USER_ID,
}));

describe("Users Service", () => {
  describe("findAll", () => {
    it("should return all users", async () => {
      const expectedUsers = [MOCK_USER];
      jest
        .spyOn(UsersService["mongoDB"], "getAll")
        .mockResolvedValue(expectedUsers as any);

      const users = await UsersService.findAll();

      expect(users).toEqual(expectedUsers);
    });

    it("should throw an error when no users found", async () => {
      jest
        .spyOn(UsersService["mongoDB"], "getAll")
        .mockResolvedValue(null as any);

      try {
        await UsersService.findAll();
      } catch (error) {
        expect(error).toEqual("users not found");
      }
    });
  });
  describe("findOne", () => {
    it("should return expected user", async () => {
      const expectedUser = MOCK_USER;
      jest
        .spyOn(UsersService["mongoDB"], "getById")
        .mockResolvedValue(expectedUser as any);

      const user = await UsersService.findOne(
        "65a06b9b-72ee-4cd7-9227-3934d3c8e02b"
      );

      expect(user).toEqual(expectedUser);
    });

    it("should throw an error when user was not found", async () => {
      jest
        .spyOn(UsersService["mongoDB"], "getById")
        .mockResolvedValue(null as any);

      try {
        await UsersService.findOne(MOCK_USER_ID);
      } catch (error) {
        expect(error).toEqual(`user with id ${MOCK_USER_ID} not found`);
      }
    });
  });
  describe("create", () => {
    it("should create user", async () => {
      jest.spyOn(UsersService["mongoDB"], "create").mockResolvedValue({});

      const user = await UsersService.create({
        fullname: "TestFirstName1 TestLastName1",
        email: "testemail1@example.com",
        password: "12345678",
      });

      expect(uuidv4()).toEqual(MOCK_USER_ID);
      expect(user).toEqual(
        `successfully created a new user with id ${MOCK_USER_ID}`
      );
    });

    it("should throw an error when user was not created", async () => {
      jest
        .spyOn(UsersService["mongoDB"], "create")
        .mockResolvedValue(null as any);

      try {
        await UsersService.create({
          fullname: "TestFirstName1 TestLastName1",
          email: "testemail1@example.com",
          password: "12345678",
        });
      } catch (error) {
        expect(error).toEqual(`failed to create a new user`);
      }
    });
  });
  describe("update", () => {
    it("should update an user", async () => {
      const expectedUser = MOCK_USER;
      jest
        .spyOn(UsersService, "findOne")
        .mockResolvedValue(expectedUser as any);

      jest.spyOn(UsersService["mongoDB"], "updateOneById").mockResolvedValue({
        ...expectedUser,
        fullname: "TestFirstName2 TestLastName2",
      });

      const user = await UsersService.update(MOCK_USER_ID, {
        fullname: "TestFirstName2 TestLastName2",
      });

      expect(user).toEqual({
        ...expectedUser,
        fullname: "TestFirstName2 TestLastName2",
      });
    });

    it("should throw an error when does not find an user", async () => {
      jest.spyOn(UsersService, "findOne").mockResolvedValue(null as any);

      try {
        await UsersService.update(MOCK_USER_ID, {
          fullname: "TestFirstName2 TestLastName2",
        });
      } catch (error) {
        expect(error).toEqual(`user with id ${MOCK_USER_ID} not found`);
      }
    });
  });
  describe("delete", () => {
    it("should delete an user", async () => {
      const expectedUser = MOCK_USER;
      jest
        .spyOn(UsersService, "findOne")
        .mockResolvedValue(expectedUser as any);

      jest.spyOn(UsersService["mongoDB"], "deleteOneById").mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
      });

      const user = await UsersService.delete(MOCK_USER_ID);

      expect(user).toEqual({
        acknowledged: true,
        deletedCount: 1,
      });
    });
    it("should throw an error when does not find an user", async () => {
      jest.spyOn(UsersService, "findOne").mockResolvedValue(null as any);

      try {
        await UsersService.delete(MOCK_USER_ID);
      } catch (error) {
        expect(error).toEqual(`user with id ${MOCK_USER_ID} not found`);
      }
    });
  });
});
