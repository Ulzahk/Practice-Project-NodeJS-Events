'use strict';
const UsersService = require('./users.service');
const { Observable } = require('rxjs');

const UsersObservable = new Observable((subscriber) => {
  (async () => {
    const users = await UsersService.findAll();
    subscriber.next(users);
  })()
    .then(
      () => subscriber.complete(),
      (error) => subscriber.error(error)
    );
});

module.exports = UsersObservable;