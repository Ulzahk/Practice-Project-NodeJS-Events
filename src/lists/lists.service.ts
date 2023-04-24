import { CreateListDto, UpdateListDto } from "@lists/lists.dto";
import { List } from "@lists/lists.model";
import { v4 as uuidv4 } from "uuid";
import { MongoDatabase } from "@database/database.service";
import { config } from "@config/env-variables";
import UsersService from "@users/users.service";

class ListsService {
  private collection;
  private mongoDB;
  private usersService;

  constructor() {
    this.collection = config.listsCollectionName;
    this.mongoDB = new MongoDatabase();
    this.usersService = new UsersService();
  }

  async findAll() {
    const lists = await this.mongoDB.getAll(this.collection!);
    if (lists) return lists;
    throw `lists not found`;
  }

  async findAllByUserId(userId: string) {
    await this.validateUser(userId);

    const list = await this.mongoDB.getAllByQuery(this.collection!, { userId });
    if (list) return list;
    throw `lists for user with id ${userId} not found`;
  }

  async findOne(id: string) {
    const list = await this.mongoDB.getById(this.collection!, id);
    if (list) return list;
    throw `list with id ${id} not found`;
  }

  async create(payload: CreateListDto) {
    await this.validateUser(payload.userId);

    const newId = uuidv4();
    const newDate: string = new Date().toISOString();
    const newList: List = {
      id: newId,
      ...payload,
      createdAt: newDate,
      updatedAt: newDate,
    };

    const result = await this.mongoDB.create(this.collection!, newList);
    if (result) return `successfully created a new list with id ${newId}`;
    throw "failed to create a new list";
  }

  async update(id: string, payload: UpdateListDto) {
    if (payload.userId) await this.validateUser(payload.userId);

    const list = await this.findOne(id);
    if (!list) throw `list with id ${id} not found`;

    const newDate: string = new Date().toISOString();
    return await this.mongoDB.updateOneById(this.collection!, id, {
      pdatedAt: newDate,
      ...payload,
    });
  }

  async delete(id: string) {
    const list = await this.findOne(id);
    if (!list) throw `list with id ${id} not found`;

    return await this.mongoDB.deleteOneById(this.collection!, id);
  }

  async validateUser(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw `user with id ${userId} not found`;
    return user;
  }
}

export default ListsService;
