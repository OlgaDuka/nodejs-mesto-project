import { Document, Model, Schema } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

export type AuthContext = {
  user: JwtPayload | null
};

export interface IUser {
  name?: string;
  about?: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface IUserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

export interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
}
