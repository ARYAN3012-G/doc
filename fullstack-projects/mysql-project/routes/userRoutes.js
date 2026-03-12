import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    toggleUser,
    deleteUser
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.patch('/:id/toggle', toggleUser);
router.delete('/:id', deleteUser);

export default router;
