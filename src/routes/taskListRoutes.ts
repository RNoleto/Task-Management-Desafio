import express from 'express';
import { createTaskList, getTaskLists, updateTaskList, deleteTaskList } from '../controllers/taskListController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authenticate);

router.post('/', createTaskList);
router.get('/', getTaskLists);
router.put('/:id', updateTaskList);
router.delete('/:id', deleteTaskList);

export default router; 