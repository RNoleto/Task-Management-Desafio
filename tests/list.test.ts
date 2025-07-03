import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import User from '../src/models/User';
import TaskList from '../src/models/TaskList';
import bcrypt from 'bcrypt';

let token: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || '', { dbName: 'bext_teste_test' });
  await User.deleteMany({});
  await TaskList.deleteMany({});
  const senhaHash = await bcrypt.hash('123456', 10);
  await User.create({ nome: 'ListUser', email: 'list@teste.com', senha: senhaHash });
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'list@teste.com', senha: '123456' });
  token = res.body.token;
});

afterAll(async () => {
  await User.deleteMany({});
  await TaskList.deleteMany({});
  await mongoose.connection.close();
});

describe('Listas de Tarefas', () => {
  let listId: string;

  it('deve criar uma lista', async () => {
    const res = await request(app)
      .post('/api/lists')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Minha Lista Teste' });
    expect(res.status).toBe(201);
    expect(res.body.nome).toBe('Minha Lista Teste');
    listId = res.body._id;
  });

  it('deve listar as listas do usuário', async () => {
    const res = await request(app)
      .get('/api/lists')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('deve atualizar o nome da lista', async () => {
    const res = await request(app)
      .put(`/api/lists/${listId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Lista Atualizada' });
    expect(res.status).toBe(200);
    expect(res.body.nome).toBe('Lista Atualizada');
  });

  it('deve deletar a lista', async () => {
    const res = await request(app)
      .delete(`/api/lists/${listId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Lista deletada.');
  });

  it('não deve criar lista sem nome', async () => {
    const res = await request(app)
      .post('/api/lists')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Nome da lista é obrigatório.');
  });
}); 