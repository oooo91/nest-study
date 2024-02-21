import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { prisma } from '../utils/prisma/index.js';
import { PostsService } from '../services/posts.service.js';
import { PostsRepository } from '../repositories/posts.repository.js';
import { PostsController } from '../controllers/posts.controller.js';

const router = express.Router();

const postsRepository = new PostsRepository(prisma);
const postsService = new PostsService(postsRepository);
const postsController = new PostsController(postsService);

router.post('/', authMiddleware, postsController.createPost);
router.get('/', authMiddleware, postsController.getPosts);
router.get('/:postId', authMiddleware, postsController.getPostById);
router.patch('/:postId', authMiddleware, postsController.updatePost);
router.delete('/:postId', authMiddleware, postsController.deletePost);

export default router;