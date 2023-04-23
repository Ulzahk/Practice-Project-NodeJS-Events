import { config } from "@config/env-variables";
import { MongoDatabase } from "@database/database.service";
import { CreateTaskDto, UpdateTaskDto } from "@tasks/tasks.dto";
import { v4 as uuidv4 } from "uuid";
import ListsService from "@lists/lists.service";
import { Task } from "./tasks.model";

class TasksService {
  private collection;
  private mongoDB;
  private listsService;

  constructor() {
    this.collection = config.tasksCollectionName;
    this.mongoDB = new MongoDatabase();
    this.listsService = new ListsService();
  }

  async findAll() {
    const lists = await this.mongoDB.getAll(this.collection!);
    if (lists) return lists;
    throw `tasks not found`;
  }

  async findAllByListId(listId: string) {
    await this.validateList(listId);

    const list = await this.mongoDB.getByQuery(this.collection!, { listId });
    if (list) return list;
    throw `tasks for list with id ${listId} not found`;
  }

  async findOne(id: string) {
    const list = await this.mongoDB.getById(this.collection!, id);
    if (list) return list;
    throw `task with id ${id} not found`;
  }

  async create(payload: CreateTaskDto) {
    await this.validateList(payload.listId);

    const newId = uuidv4();
    const newDate: string = new Date().toISOString();
    const newList: Task = {
      id: newId,
      ...payload,
      isCompleted: false,
      createdAt: newDate,
      updatedAt: newDate,
    };

    const result = await this.mongoDB.create(this.collection!, newList);
    if (result) return `successfully created a new task with id ${newId}`;
    throw "failed to create a new task";
  }

  async update(id: string, payload: UpdateTaskDto) {
    if (payload.listId) await this.validateList(payload.listId);

    const task = await this.findOne(id);
    if (!task) throw `task with id ${id} not found`;

    return await this.mongoDB.updateOneById(this.collection!, id, payload);
  }

  async delete(id: string) {
    const task = await this.findOne(id);
    if (!task) throw `task with id ${id} not found`;

    return await this.mongoDB.deleteOneById(this.collection!, id);
  }

  async validateList(listId: string) {
    const list = await this.listsService.findOne(listId);
    if (!list) throw `list with id ${listId} not found`;
    return list;
  }
}

export default TasksService;
