import { IncomingMessage, ServerResponse } from "http";

export interface ICommonHandler {
  req: IncomingMessage;
  res: ServerResponse;
  pathname: string;
}

export interface IBaseModel {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly deletedAt?: string;
}

export interface IBaseSubjectResponse {
  code: number;
}