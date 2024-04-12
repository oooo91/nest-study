import express from 'express';
import PostsRouter from "./posts.router.js";
import UsersRouter from "./users.router.js";

const router = express.Router();

router.use('/users/', UsersRouter);
router.use('/posts/', PostsRouter);

export default router;
