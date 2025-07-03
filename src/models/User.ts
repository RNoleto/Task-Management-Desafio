import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  nome: string;
  email: string;
  senha: string;
  criadoEm: Date;
}

const UserSchema = new Schema<IUser>({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  senha: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema); 