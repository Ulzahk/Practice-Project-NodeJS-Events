'use strict';
const { users } = require('../database');

class UsersService {
  constructor() { }

  async getUsers() {
    return new Promise(function (resolve, _) {
      resolve(users);
    });
  }
}


module.exports = new UsersService();