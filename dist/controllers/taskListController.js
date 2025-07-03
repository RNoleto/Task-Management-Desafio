"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskList = exports.updateTaskList = exports.getTaskLists = exports.createTaskList = void 0;
const TaskList_1 = __importDefault(require("../models/TaskList"));
const createTaskList = async (req, res) => {
    try {
        const { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ message: 'Nome da lista é obrigatório.' });
        }
        const taskList = await TaskList_1.default.create({ nome, user: req.userId });
        return res.status(201).json(taskList);
    }
    catch (err) {
        return res.status(500).json({ message: 'Erro ao criar lista.' });
    }
};
exports.createTaskList = createTaskList;
const getTaskLists = async (req, res) => {
    try {
        const lists = await TaskList_1.default.find({ user: req.userId });
        return res.status(200).json(lists);
    }
    catch (err) {
        return res.status(500).json({ message: 'Erro ao buscar listas.' });
    }
};
exports.getTaskLists = getTaskLists;
const updateTaskList = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;
        const list = await TaskList_1.default.findOneAndUpdate({ _id: id, user: req.userId }, { nome }, { new: true });
        if (!list) {
            return res.status(404).json({ message: 'Lista não encontrada.' });
        }
        return res.status(200).json(list);
    }
    catch (err) {
        return res.status(500).json({ message: 'Erro ao atualizar lista.' });
    }
};
exports.updateTaskList = updateTaskList;
const deleteTaskList = async (req, res) => {
    try {
        const { id } = req.params;
        const list = await TaskList_1.default.findOneAndDelete({ _id: id, user: req.userId });
        if (!list) {
            return res.status(404).json({ message: 'Lista não encontrada.' });
        }
        return res.status(200).json({ message: 'Lista deletada.' });
    }
    catch (err) {
        return res.status(500).json({ message: 'Erro ao remover lista.' });
    }
};
exports.deleteTaskList = deleteTaskList;
