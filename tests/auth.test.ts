import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import User from '../src/models/User';
import bcrypt from 'bcrypt';

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || '', { dbName: 'bext_teste_test' });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it('deve registrar um novo usuário', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nome: 'Teste', email: 'teste@teste.com', senha: '123456' });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Usuário registrado com sucesso!');
  });

  it('não deve registrar usuário com email já cadastrado', async () => {
    await User.create({ nome: 'Teste2', email: 'teste2@teste.com', senha: '123456' });
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nome: 'Teste2', email: 'teste2@teste.com', senha: '123456' });
    expect(res.status).toBe(409);
    expect(res.body.message).toBe('E-mail já cadastrado.');
  });

  it('deve fazer login com sucesso', async () => {
    const senhaHash = await bcrypt.hash('123456', 10);
    await User.create({ nome: 'Login', email: 'login@teste.com', senha: senhaHash });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@teste.com', senha: '123456' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('não deve fazer login com senha errada', async () => {
    const senhaHash = await bcrypt.hash('123456', 10);
    await User.create({ nome: 'Login2', email: 'login2@teste.com', senha: senhaHash });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login2@teste.com', senha: 'errada' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Credenciais inválidas.');
  });
}); 