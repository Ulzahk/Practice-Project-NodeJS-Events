import { CreateUserDto, UpdateUserDto } from '@users/users.dto';
import { User } from '@users/users.model';
import { v4 as uuidv4 } from 'uuid';
import { users } from '@database/index';

class UsersService {
  constructor() { }

  async findAll() {
    return new Promise((resolve, _) => {
      resolve(users);
    });
  }

  async findOne(id: string) {
    return new Promise((resolve, reject) => {
      let user = users.find((item) => item.id === id);
      if (user) {
        resolve(user);
      } else {
        reject(`User with id ${id} not found`);
      }
    });
  }

  async create(payload: CreateUserDto) {
    return new Promise((resolve, _) => {
      const newId = uuidv4();
      const createdAt: string = new Date().toISOString();
      const updatedAt: string = new Date().toISOString();
      const newUser: User = {
        id: newId,
        ...payload,
        createdAt,
        updatedAt
      };

      users.push(newUser);
      resolve(newUser);
    });
  }

  async update(id: string, payload: UpdateUserDto) {
    return new Promise((resolve, reject) => {
      const user = users.find((item) => item.id === id) as User;
      if (!user) {
        reject(`No user with id ${id} found`);
      }
      const userIndex = users.findIndex((item) => item.id === id);
      users[userIndex] = { ...user, ...payload };

      resolve(users[userIndex]);
    });
  }

  async delete(id: string) {
    return new Promise((resolve, reject) => {
      const userIndex = users.findIndex((item) => item.id === id);
      if (!userIndex) {
        reject(`No user with id ${id} found`);
      }

      users.splice(userIndex, 1);

      resolve({
        message: `User with id ${id} deleted`
      });
    });
  }
}

export default new UsersService()