import { Role } from "@users/users.model";
import { ObjectId } from "mongodb";

export const MOCK_UUID = "65a06b9b-72ee-4cd7-9227-3934d3c8e02b"
export const MOCK_USER = {
  _id: new ObjectId("12343285f3d7aa7ec847c284"),
  id: MOCK_UUID,
  fullname: "TestFirstName1 TestLastName1",
  email: "testemail1@example.com",
  password: "12345678",
  role: Role.user,
  createdAt: "2000-01-01T12:00:00.000Z",
  updatedAt: "2000-01-01T12:00:00.000Z",
};
export const MOCK_USER_PAYLOAD = {
  fullname: "TestFirstName1 TestLastName1",
  email: "testemail1@example.com",
  password: "12345678",
  role: Role.user,
}
export const MOCK_LIST = {
  _id: new ObjectId("12312385f3d7aa7ec847c284"),
  id: MOCK_UUID,
  userId: MOCK_UUID,
  title: "Test List Title",
  createdAt: "2000-01-01T12:00:00.000Z",
  updatedAt: "2000-01-01T12:00:00.000Z",
}
export const MOCK_LIST_PAYLOAD = {
  userId: MOCK_UUID,
  title: "Test List Title",
}
export const MOCK_TASK = {
  _id: new ObjectId("12353285f3d7aa7ec847c284"),
  id: MOCK_UUID,
  listId: MOCK_UUID,
  title: "Test Task Title",
  description: "Test Task Description",
  deadline: "2000-01-01T12:00:00.000Z",
  createdAt: "2000-01-01T12:00:00.000Z",
  updatedAt: "2000-01-01T12:00:00.000Z",
}
export const MOCK_TASK_PAYLOAD = {
  listId: MOCK_UUID,
  title: "Test Task Title",
  description: "Test Task Description",
  deadline: "2000-01-01T12:00:00.000Z",
}
export const MOCK_TOKEN_DATA = {
  userId: MOCK_UUID,
  role: Role.admin,
  iat: 1682331459,
  exp: 1682332359
}
export const MOCK_INVALID_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMDY1YjFhYi00Y2YzLTRkODctYjkwZS01YjQ4ZTRlNzEzMjEiLCJpYXQiOjE2ODIzMzIzOTgsImV4cCI6MTY4MjQxODc5OH0.GHor1XM-8qmMdMKeGUagPPHw3l408qbh9HgtCzul123";