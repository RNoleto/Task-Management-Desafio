"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const createTask = async (req, res) => {
    try {
        const { titulo, descricao, status, dataVencimento, lista } = req.body;
        if (!titulo || !lista) {
            res.status(400).json({ message: 'Título e lista são obrigatórios.' });
            return;
        }
        const task = await Task_1.default.create({
            titulo,
            descricao,
            status: status || 'pendente',
            dataVencimento,
            lista,
            user: req.userId,
        });
        res.status(201).json(task);
    }
    catch (err) {
        res.status(500).json({ message: 'Erro ao criar tarefa.' });
    }
};
exports.createTask = createTask;
const getTasks = async (req, res) => {
    try {
        const { lista, status, dataVencimento } = req.query;
        const filter = { user: req.userId };
        if (lista)
            filter.lista = lista;
        if (status)
            filter.status = status;
        if (dataVencimento) {
            const start = new Date(dataVencimento);
            start.setHours(0, 0, 0, 0);
            const end = new Date(dataVencimento);
            end.setHours(23, 59, 59, 999);
            filter.dataVencimento = { $gte: start, $lte: end };
        }
        const tasks = await Task_1.default.find(filter);
        res.status(200).json(tasks);
    }
    catch (err) {
        res.status(500).json({ message: 'Erro ao buscar tarefas.' });
    }
};
exports.getTasks = getTasks;
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, status, dataVencimento, lista } = req.body;
        const task = await Task_1.default.findOneAndUpdate({ _id: id, user: req.userId }, { titulo, descricao, status, dataVencimento, lista }, { new: true });
        if (!task) {
            res.status(404).json({ message: 'Tarefa não encontrada.' });
            return;
        }
        res.status(200).json(task);
    }
    catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar tarefa.' });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task_1.default.findOneAndDelete({ _id: id, user: req.userId });
        if (!task) {
            res.status(404).json({ message: 'Tarefa não encontrada.' });
            return;
        }
        res.status(200).json({ message: 'Tarefa deletada.' });
    }
    catch (err) {
        res.status(500).json({ message: 'Erro ao remover tarefa.' });
    }
};
exports.deleteTask = deleteTask;
