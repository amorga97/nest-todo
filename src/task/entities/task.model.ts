import { Schema, SchemaTypes, Types } from 'mongoose';

export const taskSchema = new Schema({
  title: { type: String, required: true },
  responsible: { type: SchemaTypes.ObjectId },
  isCompleted: { type: Boolean, required: true },
});

export interface iTask {
  _id?: Types.ObjectId;
  title: string;
  responsible?: Types.ObjectId;
  isCompleted: boolean;
}
