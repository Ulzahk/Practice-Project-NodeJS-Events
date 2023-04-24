import { IBaseModel } from "@common/interfaces";

export enum Role {
  admin = "admin",
  user = "user",
}
export interface User extends IBaseModel {
  fullname: string;
  email: string;
  password: string;
  role: Role;
}
