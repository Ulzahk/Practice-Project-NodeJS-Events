import { IBaseModel } from '@common/interfaces';

export interface User extends IBaseModel {
  fullname: string;
  email: string;
  password: string;
}