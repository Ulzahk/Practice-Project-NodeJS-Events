import { MongoClient, Db, ObjectId, Collection } from "mongodb";
import { MongoDatabase } from "@database/database.service";
import { config } from "@config/env-variables";

const TEST_COLLECTION = "testCollection";
const MOCK_USER_ID = "65a06b9b-72ee-4cd7-9227-3934d3c8e02b";
const MOCK_USER = {
  _id: new ObjectId("12343285f3d7aa7ec847c284"),
  id: MOCK_USER_ID,
  fullname: "TestFirstName1 TestLastName1",
  email: "testemail1@example.com",
  password: "12345678",
  createdAt: "2000-01-01T12:00:00.000Z",
  updatedAt: "2000-01-01T12:00:00.000Z",
};

describe("MongoDatabase", () => {
  let db: Db;
  let mongoClient: MongoClient;
  let mongoDatabase: MongoDatabase;

  beforeAll(async () => {
    mongoClient = new MongoClient(config.dbConnectionString!);
    await mongoClient.connect();
    db = mongoClient.db(config.dbName);
    mongoDatabase = new MongoDatabase();
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  beforeEach(async () => {
    await db.collection(TEST_COLLECTION).deleteMany({});
    await db.collection(TEST_COLLECTION).insertOne(MOCK_USER);
  });

  describe("connect", () => {
    it("should connect to the database", async () => {
      const connection = await mongoDatabase.connect();
      expect(connection).toBeInstanceOf(Db);
      expect(connection?.databaseName).toBe(config.dbName);
    });
  });

  describe("getAll", () => {
    it("should return all documents in the collection", async () => {
      const result = await mongoDatabase.getAll(TEST_COLLECTION);
      expect(result).toHaveLength(1);
      expect(result?.[0]).toEqual(MOCK_USER);
    });
  });

  describe("getById", () => {
    it("should return a document by its id", async () => {
      const result = await mongoDatabase.getById(TEST_COLLECTION, MOCK_USER_ID);
      expect(result).toEqual(MOCK_USER);
    });
  });

  describe("create", () => {
    it("should insert a new document into the collection", async () => {
      const data = {
        ...MOCK_USER,
        _id: new ObjectId("123bc285f3d7aa7ec847c284"),
        id: "8edf418a-5fb1-401f-9ab6-09a1d6f9d63e",
      };
      const result = await mongoDatabase.create(TEST_COLLECTION, data);

      expect(result).toMatchObject({
        acknowledged: true,
        insertedId: expect.anything(),
      });

      const insertedDocument = await db
        .collection(TEST_COLLECTION)
        .findOne({ id: "8edf418a-5fb1-401f-9ab6-09a1d6f9d63e" });
      expect(insertedDocument).toEqual(data);
    });
  });

  describe("updateOneById", () => {
    it("should update a document by its id", async () => {
      const data = {
        fullname: "Test",
      };
      const result = await mongoDatabase.updateOneById(
        TEST_COLLECTION,
        MOCK_USER_ID,
        data
      );

      expect(result).toEqual({
        ...MOCK_USER,
        fullname: data.fullname,
      });

      const updatedDocument = await db
        .collection(TEST_COLLECTION)
        .findOne({ id: MOCK_USER_ID });
      expect(updatedDocument).toEqual(result);
    });
  });

  describe("deleteOneById", () => {
    it("should delete a document by its id", async () => {
      const result = await mongoDatabase.deleteOneById(
        TEST_COLLECTION,
        MOCK_USER_ID
      );
      expect(result).toMatchObject({
        deletedCount: 1,
      });

      const deletedDocument = await db
        .collection(TEST_COLLECTION)
        .findOne({ id: MOCK_USER_ID });
      expect(deletedDocument).toBeNull();
    });
  });
});
