import { IBaseModel } from "@common/interfaces";

export interface Task extends IBaseModel {
  listId: string;
  title: string;
  description?: string;
  deadline?: string;
  isCompleted: boolean;
}
