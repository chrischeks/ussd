import { Document } from "mongoose";
import { IAuthor } from '../interfaces/authorInterface';

export interface IAuthorModel extends IAuthor, Document {
  //custom methods for your model would be defined here
}