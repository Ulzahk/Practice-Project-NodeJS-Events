import UsersService from "@users/users.service";
import { MOCK_UUID, MOCK_USER, MOCK_USER_PAYLOAD } from "@mocks/main";
import { v4 as uuidv4 } from "uuid";

jest.mock("uuid", () => ({
  v4: () => MOCK_UUID,
}));

describe("Users Service", () => {
  const usersService = new UsersService();

  describe("findAll", () => {
    it("should return all users", async () => {
      jest
        .spyOn(usersService["mongoDB"], "getAll")
        .mockResolvedValue([MOCK_USER]);

      const result = await usersService.findAll();

      expect(result).toEqual([MOCK_USER]);
    });

    it("should throw an error when no users found", async () => {
      jest
        .spyOn(usersService["mongoDB"], "getAll")
        .mockResolvedValue(null as any);

      try {
        await usersService.findAll();
      } catch (error) {
        expect(error).toEqual("users not found");
      }
    });
  });

  describe("findOne", () => {
    it("should return expected user", async () => {
      jest
        .spyOn(usersService["mongoDB"], "getById")
        .mockResolvedValue(MOCK_USER);

      const result = await usersService.findOne(MOCK_UUID);

      expect(result).toEqual(MOCK_USER);
    });

    it("should throw an error when user was not found", async () => {
      jest
        .spyOn(usersService["mongoDB"], "getById")
        .mockResolvedValue(null as any);

      try {
        await usersService.findOne(MOCK_UUID);
      } catch (error) {
        expect(error).toEqual(`user with id ${MOCK_UUID} not found`);
      }
    });
  });

  describe("create", () => {
    it("should create an user", async () => {
      jest
        .spyOn(usersService["mongoDB"], "create")
        .mockResolvedValue({} as any);

      const result = await usersService.create(MOCK_USER_PAYLOAD);

      expect(uuidv4()).toEqual(MOCK_UUID);
      expect(result).toEqual(
        `successfully created a new user with id ${MOCK_UUID}`
      );
    });

    it("should throw an error when user was not created", async () => {
      jest
        .spyOn(usersService["mongoDB"], "create")
        .mockResolvedValue(null as any);

      try {
        await usersService.create(MOCK_USER_PAYLOAD);
      } catch (error) {
        expect(error).toEqual(`failed to create a new user`);
      }
    });
  });

  describe("update", () => {
    it("should update an user", async () => {
      jest.spyOn(usersService, "findOne").mockResolvedValue(MOCK_USER);

      jest.spyOn(usersService["mongoDB"], "updateOneById").mockResolvedValue({
        ...MOCK_USER,
        fullname: "TestFirstName2 TestLastName2",
      });

      const result = await usersService.update(MOCK_UUID, {
        fullname: "TestFirstName2 TestLastName2",
      });

      expect(result).toEqual({
        ...MOCK_USER,
        fullname: "TestFirstName2 TestLastName2",
      });
    });

    it("should throw an error when does not find an user", async () => {
      jest.spyOn(usersService, "findOne").mockResolvedValue(null as any);

      try {
        await usersService.update(MOCK_UUID, {
          fullname: "TestFirstName2 TestLastName2",
        });
      } catch (error) {
        expect(error).toEqual(`user with id ${MOCK_UUID} not found`);
      }
    });
  });

  describe("delete", () => {
    it("should delete an user", async () => {
      jest.spyOn(usersService, "findOne").mockResolvedValue(MOCK_USER);

      jest.spyOn(usersService["mongoDB"], "deleteOneById").mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
      });

      const result = await usersService.delete(MOCK_UUID);

      expect(result).toEqual({
        acknowledged: true,
        deletedCount: 1,
      });
    });
    it("should throw an error when does not find an user", async () => {
      jest.spyOn(usersService, "findOne").mockResolvedValue(null as any);

      try {
        await usersService.delete(MOCK_UUID);
      } catch (error) {
        expect(error).toEqual(`user with id ${MOCK_UUID} not found`);
      }
    });
  });
});
