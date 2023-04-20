import { MongoClient, Collection, Db } from "mongodb";
import { config } from "@config/env-variables";

export const collections: {
  users?: Collection;
  lists?: Collection;
  tasks?: Collection;
} = {};

export async function connectToDatabase() {
  const client: MongoClient = new MongoClient(config.dbConnectionString!);
  await client.connect();

  const db: Db = client.db(config.dbName!);

  collections.users = db.collection(config.usersCollectionName!) as Collection;
  collections.lists = db.collection(config.listsCollectionName!) as Collection;
  collections.tasks = db.collection(config.tasksCollectionName!) as Collection;
}

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
        console.error(error);
      }
    }
    return this.connection;
  }

  async getAll(collection: string) {
    const db: typeof this.connection = await this.connect();
    return db?.collection(collection).find().toArray();
  }

  async getById(collection: string, id: string) {
    const db: typeof this.connection = await this.connect();
    return db?.collection(collection).findOne({ id });
  }

  async create(collection: string, data: any) {
    const db: typeof this.connection = await this.connect();
    const result: unknown = await db?.collection(collection).insertOne(data);
    return result;
  }

  async updateOneById(collection: string, id: string, data: any) {
    const db: typeof this.connection = await this.connect();
    const result: any = await db
      ?.collection(collection)
      .findOneAndUpdate({ id }, { $set: data });
    return result.value;
  }

  async deleteOneById(collection: string, id: string) {
    const db: typeof this.connection = await this.connect();
    const result = await db?.collection(collection).deleteOne({ id });
    return result;
  }
}
