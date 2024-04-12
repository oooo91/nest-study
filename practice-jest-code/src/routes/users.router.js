import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import { UsersService } from '../services/users.service.js';
import { UsersRepository } from '../repositories/users.repository.js';
import { UsersController } from '../controllers/users.controller.js';

const router = express.Router();

const usersRepository = new UsersRepository();
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

router.post('/sign-up', usersController.signUp);
router.post('/sign-in', usersController.signIn);
router.get('/user', authMiddleware, usersController.getUser);

export default router;
