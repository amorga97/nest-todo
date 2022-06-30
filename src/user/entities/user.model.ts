import { Schema, SchemaTypes, Types } from 'mongoose';

const isEmail = (email: string) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

export const userSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validate: [isEmail, 'Provided email is not valid.'],
    unique: true,
  },
  tasks: [{ type: SchemaTypes.ObjectId, ref: 'Task' }],
  password: { type: String, minlength: 5 },
});

export interface iUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  tasks: Types.ObjectId[];
}
