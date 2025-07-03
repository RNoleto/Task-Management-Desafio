import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
      return;
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(409).json({ message: 'E-mail já cadastrado.' });
      return;
    }
    const hash = await bcrypt.hash(senha, 10);
    await User.create({ nome, email, senha: hash });
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      res.status(400).json({ message: 'Email e senha são obrigatórios.' });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Credenciais inválidas.' });
      return;
    }
    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) {
      res.status(401).json({ message: 'Credenciais inválidas.' });
      return;
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao fazer login.' });
  }
}; 