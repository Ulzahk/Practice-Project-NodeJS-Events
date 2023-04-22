import { ObjectId } from "mongodb";

export const MOCK_UUID = "65a06b9b-72ee-4cd7-9227-3934d3c8e02b"
export const MOCK_USER = {
  _id: new ObjectId("12343285f3d7aa7ec847c284"),
  id: MOCK_UUID,
  fullname: "TestFirstName1 TestLastName1",
  email: "testemail1@example.com",
  password: "12345678",
  createdAt: "2000-01-01T12:00:00.000Z",
  updatedAt: "2000-01-01T12:00:00.000Z",
};
export const MOCK_USER_PAYLOAD = {
  fullname: "TestFirstName1 TestLastName1",
  email: "testemail1@example.com",
  password: "12345678",
}
export const MOCK_LIST = {
  id: MOCK_UUID,
  userId: MOCK_UUID,
  title: "Test Title",
  createdAt: "2000-01-01T12:00:00.000Z",
  updatedAt: "2000-01-01T12:00:00.000Z",
}
export const MOCK_LIST_PAYLOAD = {
  userId: MOCK_UUID,
  title: "Test Title",
}