import { CreateUserDto, UpdateUserDto } from '@users/users.dto';
import { User } from '@users/users.model';
import { v4 as uuidv4 } from 'uuid';
import { users } from '@database/index';
import { collections } from '@database/database.service';

class UsersService {
  constructor() { }

  async findAll() {
    const usersMongo = (await collections.users?.find({}).toArray());

    if (usersMongo) return usersMongo;

    throw `users not found`;
  }

  async findOne(id: string) {
    const query = { id };
    const user = (await collections.users?.findOne(query));

    if (user) return user;

    throw `user with id ${id} not found`;
  }

  async create(payload: CreateUserDto) {
    const newId = uuidv4();
    const createdAt: string = new Date().toISOString();
    const updatedAt: string = new Date().toISOString();
    const newUser: User = {
      id: newId,
      ...payload,
      createdAt,
      updatedAt
    }

    const result = await collections.users?.insertOne(newUser);
    if (result) return `successfully created a new user with id ${newId}`;

    throw 'failed to create a new user';
  }

  async update(id: string, payload: UpdateUserDto) {
    const query = { id };
    const user = (await collections.users?.findOne(query));
    if (!user) throw `user with id ${id} not found`;

    return await collections.users?.updateOne(query, { $set: payload });
  }

  async delete(id: string) {
    const query = { id };
    const user = (await collections.users?.findOne(query));
    if (!user) throw `user with id ${id} not found`;

    return await collections.users?.deleteOne(query);
  }
}

export default new UsersService()