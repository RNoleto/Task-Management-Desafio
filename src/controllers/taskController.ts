import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { titulo, descricao, status, dataVencimento, lista } = req.body;
    if (!titulo || !lista) {
      res.status(400).json({ message: 'Título e lista são obrigatórios.' });
      return;
    }
    const task = await Task.create({
      titulo,
      descricao,
      status: status || 'pendente',
      dataVencimento,
      lista,
      user: req.userId,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar tarefa.' });
  }
};

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lista, status, dataVencimento } = req.query;
    const filter: any = { user: req.userId };
    if (lista) filter.lista = lista;
    if (status) filter.status = status;
    if (dataVencimento) {
      const start = new Date(dataVencimento as string);
      start.setHours(0, 0, 0, 0);
      const end = new Date(dataVencimento as string);
      end.setHours(23, 59, 59, 999);
      filter.dataVencimento = { $gte: start, $lte: end };
    }
    const tasks = await Task.find(filter);
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar tarefas.' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { titulo, descricao, status, dataVencimento, lista } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.userId },
      { titulo, descricao, status, dataVencimento, lista },
      { new: true }
    );
    if (!task) {
      res.status(404).json({ message: 'Tarefa não encontrada.' });
      return;
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar tarefa.' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.userId });
    if (!task) {
      res.status(404).json({ message: 'Tarefa não encontrada.' });
      return;
    }
    res.status(200).json({ message: 'Tarefa deletada.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover tarefa.' });
  }
}; 