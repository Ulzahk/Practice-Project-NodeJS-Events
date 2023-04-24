import { CreateUserDto, UpdateUserDto } from "@users/users.dto";
import { User } from "@users/users.model";
import { v4 as uuidv4 } from "uuid";
import { MongoDatabase } from "@database/database.service";
import { config } from "@config/env-variables";
import bcrypt from "bcrypt";

class UsersService {
  private collection;
  private mongoDB;

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

  async findOneByEmail(email: string) {
    const lowerCaseEmail = email.toLowerCase();
    const user = await this.mongoDB.getByQuery(this.collection!, {
      email: lowerCaseEmail,
    });
    if (user) return user;
    throw `invalid information`;
  }

  async create(payload: CreateUserDto) {
    const newId = uuidv4();
    const encriptedPassword = await bcrypt.hash(payload.password, 10);
    const lowerCaseEmail = payload.email.toLowerCase();
    const newDate: string = new Date().toISOString();
    const newUser: User = {
      id: newId,
      ...payload,
      email: lowerCaseEmail,
      password: encriptedPassword,
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

    const { email, password } = payload;
    const newDate: string = new Date().toISOString();

    return await this.mongoDB.updateOneById(this.collection!, id, {
      ...payload,
      updatedAt: newDate,
      ...(email && { email: email.toLowerCase() }),
      ...(password && { password: await bcrypt.hash(password, 10) }),
    });
  }

  async delete(id: string) {
    const user = await this.findOne(id);
    if (!user) throw `user with id ${id} not found`;

    return await this.mongoDB.deleteOneById(this.collection!, id);
  }
}

export default UsersService;
