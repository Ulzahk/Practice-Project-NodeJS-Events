import { CreateUserDto, UpdateUserDto } from "@users/users.dto";
import { User } from "@users/users.model";
import { v4 as uuidv4 } from "uuid";
import { MongoDatabase, collections } from "@database/database.service";
import { config } from "@config/env-variables";

class UsersService {
  private collection;
  public mongoDB;

  constructor() {
    this.collection = config.usersCollectionName;
    this.mongoDB = new MongoDatabase();
  }

  async findAll() {
    const users = await this.mongoDB.getAll(this.collection!);
    if (users) return users;
    throw `users not found`;
  }

  async findOne(id: string) {
    const user = await this.mongoDB.getById(this.collection!, id);
    if (user) return user;
    throw `user with id ${id} not found`;
  }

  async create(payload: CreateUserDto) {
    const newId = uuidv4();
    const newDate: string = new Date().toISOString();
    const newUser: User = {
      id: newId,
      ...payload,
      createdAt: newDate,
      updatedAt: newDate,
    };

    const result = await this.mongoDB.create(this.collection!, newUser);
    if (result) return `successfully created a new user with id ${newId}`;
    throw "failed to create a new user";
  }

  async update(id: string, payload: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw `user with id ${id} not found`;

    return await this.mongoDB.updateOneById(this.collection!, id, payload);
  }

  async delete(id: string) {
    const user = await this.findOne(id);
    if (!user) throw `user with id ${id} not found`;

    return await this.mongoDB.deleteOneById(this.collection!, id);
  }
}

export default new UsersService();
