"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const taskListRoutes_1 = __importDefault(require("./routes/taskListRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
// Carregar variáveis de ambiente
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares globais
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Conexão com o MongoDB
const mongoUri = process.env.MONGO_URI || '';
mongoose_1.default.connect(mongoUri)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));
// Rotas de exemplo (remover depois)
app.get('/', (req, res) => {
    res.send('API Task Management rodando!');
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/lists', taskListRoutes_1.default);
app.use('/api/tasks', taskRoutes_1.default);
exports.default = app;
// Inicialização do servidor (apenas se não estiver em ambiente de teste)
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}
