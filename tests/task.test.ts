import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import User from '../src/models/User';
import TaskList from '../src/models/TaskList';
import Task from '../src/models/Task';
import bcrypt from 'bcrypt';

let token: string;
let listId: string;
let taskId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || '', { dbName: 'bext_teste_test' });
  await User.deleteMany({});
  await TaskList.deleteMany({});
  await Task.deleteMany({});
  const senhaHash = await bcrypt.hash('123456', 10);
  await User.create({ nome: 'TaskUser', email: 'task@teste.com', senha: senhaHash });
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'task@teste.com', senha: '123456' });
  token = res.body.token;
  // Cria uma lista para vincular tarefas
  const listRes = await request(app)
    .post('/api/lists')
    .set('Authorization', `Bearer ${token}`)
    .send({ nome: 'Lista para Tarefas' });
  listId = listRes.body._id;
});

afterAll(async () => {
  await User.deleteMany({});
  await TaskList.deleteMany({});
  await Task.deleteMany({});
  await mongoose.connection.close();
});

describe('Tarefas', () => {
  it('deve criar uma tarefa', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Tarefa Teste',
        descricao: 'Descrição da tarefa',
        status: 'pendente',
        dataVencimento: '2025-07-10',
        lista: listId
      });
    expect(res.status).toBe(201);
    expect(res.body.titulo).toBe('Tarefa Teste');
    taskId = res.body._id;
  });

  it('deve listar tarefas com filtro por lista', async () => {
    const res = await request(app)
      .get(`/api/tasks?lista=${listId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('deve atualizar uma tarefa', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Tarefa Atualizada', status: 'concluída' });
    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe('Tarefa Atualizada');
    expect(res.body.status).toBe('concluída');
  });

  it('deve deletar uma tarefa', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Tarefa deletada.');
  });

  it('não deve criar tarefa sem título', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ lista: listId });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Título e lista são obrigatórios.');
  });
}); 