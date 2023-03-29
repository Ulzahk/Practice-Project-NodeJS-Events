import * as dotenv from 'dotenv'

dotenv.config()
const { PORT, DB_CONNECTION_STRING, DB_NAME, USERS_COLLECTION_NAME } = process.env

export const config = {
  port: PORT || 3000,
  dbConnectionString: DB_CONNECTION_STRING,
  dbName: DB_NAME,
  usersCollectionName: USERS_COLLECTION_NAME,
} 