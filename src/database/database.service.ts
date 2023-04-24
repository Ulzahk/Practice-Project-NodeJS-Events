import { MongoClient, Db } from "mongodb";
import { config } from "@config/env-variables";

export class MongoDatabase {
  private client;
  private dbName;
  private connection: Db | undefined;

  constructor() {
    this.client = new MongoClient(config.dbConnectionString!);
    this.dbName = config.dbName;
  }

  async connect() {
    if (!this.connection) {
      try {
        await this.client.connect();
        this.connection = this.client.db(this.dbName);
      } catch (error) {
        throw new Error("Connection to database failed");
      }
    }
    return this.connection;
  }

  async getAll(collection: string) {
    const db = await this.connect();
    return await db?.collection(collection).find().toArray();
  }

  async getById(collection: string, id: string) {
    const db = await this.connect();
    return await db?.collection(collection).findOne({ id });
  }

  async getByQuery(collection: string, query: Object) {
    const db = await this.connect();
    return await db?.collection(collection).findOne(query);
  }

  async getAllByQuery(collection: string, query: Object) {
    const db = await this.connect();
    return await db?.collection(collection).find(query).toArray();
  }

  async create(collection: string, data: Object) {
    const db = await this.connect();
    const result = await db?.collection(collection).insertOne(data);
    return result;
  }

  async updateOneById(collection: string, id: string, data: Object) {
    const db = await this.connect();
    const result = await db
      ?.collection(collection)
      .findOneAndUpdate({ id }, { $set: data }, { returnDocument: "after" });
    return result.value;
  }

  async deleteOneById(collection: string, id: string) {
    const db = await this.connect();
    const result = await db?.collection(collection).deleteOne({ id });
    return result;
  }
}
