import UsersService from "@users/users.service";
import ListsService from "@lists/lists.service";
import {
  MOCK_UUID,
  MOCK_LIST,
  MOCK_USER,
  MOCK_LIST_PAYLOAD,
} from "@mocks/main";
import { v4 as uuidv4 } from "uuid";

jest.mock("uuid", () => ({
  v4: () => MOCK_UUID,
}));

describe("ListsService", () => {
  const listsService = new ListsService();

  describe("findAll", () => {
    it("should return all lists", async () => {
      const expectedLists = [MOCK_LIST, MOCK_LIST, MOCK_LIST] as any;

      jest
        .spyOn(listsService["mongoDB"], "getAll")
        .mockResolvedValueOnce(expectedLists);

      const result = await listsService.findAll();
      expect(result).toEqual(expectedLists);
    });

    it("should throw an error when no lists found", async () => {
      jest
        .spyOn(listsService["mongoDB"], "getAll")
        .mockResolvedValue(null as any);

      try {
        await listsService.findAll();
      } catch (error) {
        expect(error).toEqual("lists not found");
      }
    });
  });

  describe("findAllByUserId", () => {
    it("should return all lists for a especific user", async () => {
      const expectedLists = [MOCK_LIST, MOCK_LIST, MOCK_LIST] as any;
      jest
        .spyOn(listsService["usersService"], "findOne")
        .mockResolvedValueOnce(MOCK_USER);

      jest
        .spyOn(listsService["mongoDB"], "getByQuery")
        .mockResolvedValueOnce(expectedLists);

      const result = await listsService.findAllByUserId(MOCK_UUID);
      expect(result).toEqual(expectedLists);
    });

    it("should throw an error when no lists found", async () => {
      jest
        .spyOn(listsService["usersService"], "findOne")
        .mockResolvedValueOnce(MOCK_USER);

      jest
        .spyOn(listsService["mongoDB"], "getByQuery")
        .mockResolvedValue(null as any);

      try {
        await listsService.findAllByUserId(MOCK_UUID);
      } catch (error) {
        expect(error).toEqual(`list for user with id ${MOCK_UUID} not found`);
      }
    });
  });

  describe("findOne", () => {
    it("should return expected user", async () => {
      const expectedUser = MOCK_LIST;
      jest
        .spyOn(listsService["mongoDB"], "getById")
        .mockResolvedValue(expectedUser as any);

      const user = await listsService.findOne(MOCK_UUID);

      expect(user).toEqual(expectedUser);
    });

    it("should throw an error when user was not found", async () => {
      jest
        .spyOn(listsService["mongoDB"], "getById")
        .mockResolvedValue(null as any);

      try {
        await listsService.findOne(MOCK_UUID);
      } catch (error) {
        expect(error).toEqual(`list with id ${MOCK_UUID} not found`);
      }
    });
  });

  describe("create", () => {
    it("should create a list", async () => {
      jest
        .spyOn(listsService["usersService"], "findOne")
        .mockResolvedValueOnce(MOCK_USER);

      jest
        .spyOn(listsService["mongoDB"], "create")
        .mockResolvedValue({} as any);

      const result = await listsService.create(MOCK_LIST_PAYLOAD);

      expect(uuidv4()).toEqual(MOCK_UUID);
      expect(result).toEqual(
        `successfully created a new list with id ${MOCK_UUID}`
      );
    });

    it("should throw an error when user was not created", async () => {
      jest
        .spyOn(listsService["usersService"], "findOne")
        .mockResolvedValueOnce(MOCK_USER);

      jest
        .spyOn(listsService["mongoDB"], "create")
        .mockResolvedValue(null as any);

      try {
        await listsService.create(MOCK_LIST_PAYLOAD);
      } catch (error) {
        expect(error).toEqual(`failed to create a new list`);
      }
    });
  });

  describe("update", () => {
    it("should update a list", async () => {
      const expectedList = MOCK_LIST as any;
      jest
        .spyOn(listsService["usersService"], "findOne")
        .mockResolvedValueOnce(MOCK_USER);

      jest.spyOn(listsService, "findOne").mockResolvedValue(expectedList);

      jest.spyOn(listsService["mongoDB"], "updateOneById").mockResolvedValue({
        ...expectedList,
        title: "Test Title 2",
      });

      const result = await listsService.update(MOCK_UUID, {
        title: "Test Title 2",
        userId: MOCK_UUID,
      });

      expect(result).toEqual({
        ...expectedList,
        title: "Test Title 2",
      });
    });

    it("should throw an error when does not find a list", async () => {
      jest
        .spyOn(listsService["usersService"], "findOne")
        .mockResolvedValueOnce(MOCK_USER);

      jest.spyOn(listsService, "findOne").mockResolvedValue(null as any);

      try {
        await listsService.update(MOCK_UUID, {
          title: "Test Title 2",
        });
      } catch (error) {
        expect(error).toEqual(`list with id ${MOCK_UUID} not found`);
      }
    });
  });

  describe("delete", () => {
    it("should delete an user", async () => {
      jest.spyOn(listsService, "findOne").mockResolvedValue(MOCK_LIST as any);

      jest.spyOn(listsService["mongoDB"], "deleteOneById").mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
      });

      const result = await listsService.delete(MOCK_UUID);

      expect(result).toEqual({
        acknowledged: true,
        deletedCount: 1,
      });
    });

    it("should throw an error when does not find a list", async () => {
      jest.spyOn(listsService, "findOne").mockResolvedValue(null as any);

      try {
        await listsService.delete(MOCK_UUID);
      } catch (error) {
        expect(error).toEqual(`list with id ${MOCK_UUID} not found`);
      }
    });
  });

  describe("validateUser", () => {
    it("should return expected user", async () => {
      jest
        .spyOn(listsService["usersService"], "findOne")
        .mockResolvedValue(MOCK_USER);

      const result = await listsService.validateUser(MOCK_UUID);

      expect(result).toEqual(MOCK_USER);
    });

    it("should throw an error when user was not found", async () => {
      jest
        .spyOn(listsService["usersService"], "findOne")
        .mockResolvedValue(null as any);

      try {
        await listsService.validateUser(MOCK_UUID);
      } catch (error) {
        expect(error).toEqual(`user with id ${MOCK_UUID} not found`);
      }
    });
  });
});
