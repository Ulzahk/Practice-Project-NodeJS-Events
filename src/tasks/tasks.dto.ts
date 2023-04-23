import { Task } from "@tasks/tasks.model";
import { IBaseSubjectResponse } from "@common/interfaces";

export interface CreateTaskDto
  extends Omit<
    Task,
    "id" | "isCompleted" | "createdAt" | "updatedAt" | "deletedAt"
  > {}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}

export interface TasksSubjectResponse extends IBaseSubjectResponse {
  item: Task | Task[] | string;
}
