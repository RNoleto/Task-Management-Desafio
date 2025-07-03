import mongoose, { Document, Schema } from 'mongoose';

export interface ITaskList extends Document {
  nome: string;
  user: mongoose.Types.ObjectId;
  criadoEm: Date;
}

const TaskListSchema = new Schema<ITaskList>({
  nome: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  criadoEm: { type: Date, default: Date.now },
});

export default mongoose.model<ITaskList>('TaskList', TaskListSchema); 