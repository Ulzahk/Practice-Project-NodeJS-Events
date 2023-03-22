'use strict';
const { v4: uuidv4 } = require('uuid');
const { users } = require('../database');

class UsersService {
  constructor() { }

  async findAll() {
    return new Promise((resolve, _) => {
      resolve(users);
    });
  }

  async findOne(id) {
    return new Promise((resolve, reject) => {
      let user = users.find((item) => item.id === id);
      if (user) {
        resolve(user);
      } else {
        reject(`User with id ${id} not found`);
      }
    });
  }

  async create(payload) {
    return new Promise((resolve, _) => {
      const newId = uuidv4();
      const newUser = {
        id: newId,
        ...payload,
      };

      users.push(newUser);
      resolve(newUser);
    });
  }

  async update(id, payload) {
    return new Promise((resolve, reject) => {
      const user = users.find((item) => item.id === id);
      if (!user) {
        reject(`No user with id ${id} found`);
      }
      const userIndex = users.findIndex((item) => item.id === id);
      users[userIndex] = { ...user, ...payload };

      resolve(users[userIndex]);
    });
  }

  async delete(id) {
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


module.exports = new UsersService();