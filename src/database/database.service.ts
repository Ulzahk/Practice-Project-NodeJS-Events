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

  const usersCollection: Collection = db.collection(config.usersCollectionName!)

  collections.users = usersCollection;

  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`);
}