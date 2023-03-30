# Practice API with Events Node

<div align="center">
  <p align="center">
    To do lists API uses Node events to process information
  </p>
</div>
<div align="center">

[![NodeJS](https://img.shields.io/badge/-NodeJS-f2f2f2?style=flat&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-f2f2f2?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Jest](https://img.shields.io/badge/-Jest-f2f2f2?style=flat&logo=jest&logoColor=15c213)](https://jestjs.io/)

</div>

## 🎯 Conditions

- Utilize Node events
- Use TypeScript while structuring the different entities
- It should allow to do the basic CRUD operations

## 🗺️ Diagram

![](./to-do-lists-diagram.png)

## 🐋 Docker Instructions

1. Having Docker installed in your device and the following variables in your .env file:
```
DB_NAME=test-db
DB_CONNECTION_STRING=mongodb://<username>:<password>@localhost:27017
USERS_COLLECTION_NAME=users
```
2. Execute the command `docker-compose up -d mongo`
3. When the process finished the database is ready to be used and the changes are will be saved in the folder mongo_data.
4. If you want to use a Graphic User Interface (GUI) like MongoDB Compass or Robo 3T, go to the connect section in one of these interfaces and use the following string in the SRV or Standard connection:
```
mongodb://root:root@localhost:27017/?authSource=admin&readPreference=primary
```
5. If you want to check the container running you can use the command `docker-compose ps`.
6. When you're finished to use the project remember to use `docker-compose down` to stop and remove the container with the database.