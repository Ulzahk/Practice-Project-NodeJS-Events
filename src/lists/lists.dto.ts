import { List } from "@lists/lists.model";
import { IBaseSubjectResponse } from "@common/interfaces";

export interface CreateListDto
  extends Omit<List, "id" | "createdAt" | "updatedAt" | "deletedAt"> {}

export interface UpdateListDto extends Partial<CreateListDto> {}

export interface ListsSubjectResponse extends IBaseSubjectResponse {
  item: List | List[] | string;
}
