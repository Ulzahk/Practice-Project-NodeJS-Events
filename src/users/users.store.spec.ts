import { UsersDataStore, UsersErrorStore } from "@users/users.store";
import { Subject } from "rxjs";

describe("UsersDataStore", () => {
  it("should be an instance of Subject", () => {
    expect(UsersDataStore).toBeInstanceOf(Subject);
  });
});

describe("UsersErrorStore", () => {
  it("should be an instance of Subject", () => {
    expect(UsersErrorStore).toBeInstanceOf(Subject);
  });
});
