import express from 'express';
import {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted
} from '../controllers/todoController.js';

const router = express.Router();

router.get('/', getAllTodos);
router.get('/:id', getTodoById);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.patch('/:id/toggle', toggleTodo);
router.delete('/', clearCompleted);
router.delete('/:id', deleteTodo);

export default router;
