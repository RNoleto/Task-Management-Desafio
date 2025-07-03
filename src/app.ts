import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import taskListRoutes from './routes/taskListRoutes';
import taskRoutes from './routes/taskRoutes';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
const mongoUri = process.env.MONGO_URI || '';
mongoose.connect(mongoUri)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas de exemplo (remover depois)
app.get('/', (req, res) => {
  res.send('API Task Management rodando!');
});

app.use('/api/auth', authRoutes);
app.use('/api/lists', taskListRoutes);
app.use('/api/tasks', taskRoutes);

export default app;

// Inicialização do servidor (apenas se não estiver em ambiente de teste)
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}
