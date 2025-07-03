"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskListController_1 = require("../controllers/taskListController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticate);
router.post('/', taskListController_1.createTaskList);
router.get('/', taskListController_1.getTaskLists);
router.put('/:id', taskListController_1.updateTaskList);
router.delete('/:id', taskListController_1.deleteTaskList);
exports.default = router;
