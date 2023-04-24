import TasksService from "@tasks/tasks.service";
import {
  MOCK_UUID,
  MOCK_LIST,
  MOCK_TASK,
  MOCK_TASK_PAYLOAD,
} from "@mocks/main";
import { v4 as uuidv4 } from "uuid";

jest.mock("uuid", () => ({
  v4: () => MOCK_UUID,
}));

describe("ListsService", () => {
  const tasksService = new TasksService();

  describe("findAll", () => {
    it("should return all tasks", async () => {
      const expectedTasks = [MOCK_TASK, MOCK_TASK, MOCK_TASK] as any;

      jest
        .spyOn(tasksService["mongoDB"], "getAll")
        .mockResolvedValueOnce(expectedTasks);

      const result = await tasksService.findAll();
      expect(result).toEqual(expectedTasks);
    });

    it("should throw an error when no tasks found", async () => {
      jest
        .spyOn(tasksService["mongoDB"], "getAll")
        .mockResolvedValue(null as any);

      try {
        await tasksService.findAll();
      } catch (error) {
        expect(error).toEqual("tasks not found");
      }
    });
  });

  describe("findAllByListId", () => {
    it("should return all tasks for a especific list", async () => {
      const expectedTasks = [MOCK_TASK, MOCK_TASK, MOCK_TASK] as any;
      jest
        .spyOn(tasksService["listsService"], "findOne")
        .mockResolvedValueOnce(MOCK_LIST);

      jest
        .spyOn(tasksService["mongoDB"], "getAllByQuery")
        .mockResolvedValueOnce(expectedTasks);

      const result = await tasksService.findAllByListId(MOCK_UUID);
      expect(result).toEqual(expectedTasks);
    });

    it("should throw an error when no tasks found", async () => {
      jest
        .spyOn(tasksService["listsService"], "findOne")
        .mockResolvedValueOnce(MOCK_LIST);

      jest
        .spyOn(tasksService["mongoDB"], "getAllByQuery")
        .mockResolvedValue(null as any);

      try {
        await tasksService.findAllByListId(MOCK_UUID);
      } catch (error) {
        expect(error).toEqual(`tasks for list with id ${MOCK_UUID} not found`);
      }
    });
  });

  describe("findOne", () => {
    it("should return expected task", async () => {
      const expectedResult = MOCK_LIST as any;
      jest
        .spyOn(tasksService["mongoDB"], "getById")
        .mockResolvedValue(expectedResult);

      const user = await tasksService.findOne(MOCK_UUID);

      expect(user).toEqual(expectedResult);
    });

    it("should throw an error when task was not found", async () => {
      jest
        .spyOn(tasksService["mongoDB"], "getById")
        .mockResolvedValue(null as any);

      try {
        await tasksService.findOne(MOCK_UUID);
      } catch (error) {
        expect(error).toEqual(`task with id ${MOCK_UUID} not found`);
      }
    });
  });

  describe("create", () => {
    it("should create a task", async () => {
      jest
        .spyOn(tasksService["listsService"], "findOne")
        .mockResolvedValueOnce(MOCK_LIST);

      jest
        .spyOn(tasksService["mongoDB"], "create")
        .mockResolvedValue({} as any);

      const result = await tasksService.create(MOCK_TASK_PAYLOAD);

      expect(uuidv4()).toEqual(MOCK_UUID);
      expect(result).toEqual(
        `successfully created a new task with id ${MOCK_UUID}`
      );
    });

    it("should throw an error when task was not created", async () => {
      jest
        .spyOn(tasksService["listsService"], "findOne")
        .mockResolvedValueOnce(MOCK_LIST);

      jest
        .spyOn(tasksService["mongoDB"], "create")
        .mockResolvedValue(null as any);

      try {
        await tasksService.create(MOCK_TASK_PAYLOAD);
      } catch (error) {
        expect(error).toEqual(`failed to create a new task`);
      }
    });
  });

  describe("update", () => {
    it("should update a task", async () => {
      const expectedList = MOCK_LIST as any;
      jest
        .spyOn(tasksService["listsService"], "findOne")
        .mockResolvedValueOnce(MOCK_LIST);

      jest.spyOn(tasksService, "findOne").mockResolvedValue(expectedList);

      jest.spyOn(tasksService["mongoDB"], "updateOneById").mockResolvedValue({
        ...expectedList,
        title: "Test Task Title 2",
      });

      const result = await tasksService.update(MOCK_UUID, {
        title: "Test Task Title 2",
        listId: MOCK_UUID,
      });

      expect(result).toEqual({
        ...expectedList,
        title: "Test Task Title 2",
      });
    });

    it("should throw an error when does not find a task", async () => {
      jest
        .spyOn(tasksService["listsService"], "findOne")
        .mockResolvedValueOnce(MOCK_LIST);

      jest.spyOn(tasksService, "findOne").mockResolvedValue(null as any);

      try {
        await tasksService.update(MOCK_UUID, {
          title: "Test Tasks Title 2",
        });
      } catch (error) {
        expect(error).toEqual(`task with id ${MOCK_UUID} not found`);
      }
    });
  });

  describe("delete", () => {
    it("should delete an user", async () => {
      jest.spyOn(tasksService, "findOne").mockResolvedValue(MOCK_LIST as any);

      jest.spyOn(tasksService["mongoDB"], "deleteOneById").mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
      });

      const result = await tasksService.delete(MOCK_UUID);

      expect(result).toEqual({
        acknowledged: true,
        deletedCount: 1,
      });
    });

    it("should throw an error when does not find a task", async () => {
      jest.spyOn(tasksService, "findOne").mockResolvedValue(null as any);

      try {
        await tasksService.delete(MOCK_UUID);
      } catch (error) {
        expect(error).toEqual(`task with id ${MOCK_UUID} not found`);
      }
    });
  });

  describe("validateUser", () => {
    it("should return expected list", async () => {
      jest
        .spyOn(tasksService["listsService"], "findOne")
        .mockResolvedValue(MOCK_LIST);

      const result = await tasksService.validateList(MOCK_UUID);

      expect(result).toEqual(MOCK_LIST);
    });

    it("should throw an error when list was not found", async () => {
      jest
        .spyOn(tasksService["listsService"], "findOne")
        .mockResolvedValue(null as any);

      try {
        await tasksService.validateList(MOCK_UUID);
      } catch (error) {
        expect(error).toEqual(`list with id ${MOCK_UUID} not found`);
      }
    });
  });
});
