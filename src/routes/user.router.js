import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { passportWithPolicy } from '../middlewares/authPolicy.middleware.js';

const router = express.Router();

router.get('/', passportWithPolicy(['admin']), userController.getAllUsers);
router.get('/:uid', passportWithPolicy(['admin']), userController.getUserById);
router.delete('/:uid', passportWithPolicy(['admin']), userController.deleteUser);
router.put('/:uid/role', passportWithPolicy(['admin']), userController.updateUserRole);

export default router;
