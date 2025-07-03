import { Response } from 'express';
import TaskList from '../models/TaskList';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createTaskList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nome } = req.body;
    if (!nome) {
      res.status(400).json({ message: 'Nome da lista é obrigatório.' });
      return;
    }
    const taskList = await TaskList.create({ nome, user: req.userId });
    res.status(201).json(taskList);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar lista.' });
  }
};

export const getTaskLists = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lists = await TaskList.find({ user: req.userId });
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar listas.' });
  }
};

export const updateTaskList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nome } = req.body;
    const list = await TaskList.findOneAndUpdate(
      { _id: id, user: req.userId },
      { nome },
      { new: true }
    );
    if (!list) {
      res.status(404).json({ message: 'Lista não encontrada.' });
      return;
    }
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar lista.' });
  }
};

export const deleteTaskList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const list = await TaskList.findOneAndDelete({ _id: id, user: req.userId });
    if (!list) {
      res.status(404).json({ message: 'Lista não encontrada.' });
      return;
    }
    res.status(200).json({ message: 'Lista deletada.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover lista.' });
  }
}; 