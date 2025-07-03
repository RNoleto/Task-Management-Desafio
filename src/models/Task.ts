import mongoose, { Document, Schema } from 'mongoose';

export type TaskStatus = 'pendente' | 'em andamento' | 'concluída';

export interface ITask extends Document {
  titulo: string;
  descricao: string;
  status: TaskStatus;
  dataVencimento: Date;
  lista: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  criadoEm: Date;
}

const TaskSchema = new Schema<ITask>({
  titulo: { type: String, required: true },
  descricao: { type: String },
  status: { type: String, enum: ['pendente', 'em andamento', 'concluída'], default: 'pendente' },
  dataVencimento: { type: Date },
  lista: { type: Schema.Types.ObjectId, ref: 'TaskList', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  criadoEm: { type: Date, default: Date.now },
});

export default mongoose.model<ITask>('Task', TaskSchema); 