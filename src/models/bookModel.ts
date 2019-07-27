import { Document } from "mongoose";
import { IBook } from '../interfaces/bookInterface';

export interface IBookModel extends IBook, Document {
  //custom methods for your model would be defined here
}