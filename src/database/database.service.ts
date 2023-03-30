import { MongoClient, Collection, Db } from 'mongodb';
import { config } from "@config/env-variables";


export const collections: {
  users?: Collection,
  lists?: Collection,
  tasks?: Collection,
} = {}

export async function connectToDatabase() {
  const client: MongoClient = new MongoClient(config.dbConnectionString!)
  await client.connect();

  const db: Db = client.db(config.dbName!)

  collections.users = db.collection(config.usersCollectionName!) as Collection
  collections.lists = db.collection(config.listsCollectionName!) as Collection
  collections.tasks = db.collection(config.tasksCollectionName!) as Collection
}