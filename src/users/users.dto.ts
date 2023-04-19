import { User } from "@users/users.model";
import { IBaseSubjectResponse } from "@common/interfaces";

export interface CreateUserDto
  extends Omit<User, "id" | "createdAt" | "updatedAt" | "deletedAt"> {}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface UsersSubjectResponse extends IBaseSubjectResponse {
  item: User | User[] | string;
}
