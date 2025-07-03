"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const register = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        if (!nome || !email || !senha) {
            res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
            return;
        }
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            res.status(409).json({ message: 'E-mail já cadastrado.' });
            return;
        }
        const hash = await bcrypt_1.default.hash(senha, 10);
        await User_1.default.create({ nome, email, senha: hash });
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    }
    catch (err) {
        res.status(500).json({ message: 'Erro ao registrar usuário.' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            res.status(400).json({ message: 'Email e senha são obrigatórios.' });
            return;
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Credenciais inválidas.' });
            return;
        }
        const valid = await bcrypt_1.default.compare(senha, user.senha);
        if (!valid) {
            res.status(401).json({ message: 'Credenciais inválidas.' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token });
    }
    catch (err) {
        res.status(500).json({ message: 'Erro ao fazer login.' });
    }
};
exports.login = login;
