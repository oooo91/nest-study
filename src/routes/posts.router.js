import { prisma } from "../utils/prisma/index.js";
import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/** 이력서 생성 API **/
router.post("/posts", authMiddleware, async (req, res, next) => {
  const userId = req.user.userId;
  const { title, content } = req.body;

  const post = await prisma.posts.create({
    data: {
      userId: +userId,
      title,
      content
    },
  });

  return res.status(201).json({ data: post });
});

/** 이력서 목록 조회 API */
router.get("/posts", async (req, res, next) => {
  let { orderKey, orderValue } = req.query;

  if (!orderKey) {
    orderKey = "postId";
  }

  if (!orderValue) {
    orderValue = "desc";
  }

  const post = await prisma.posts.findMany({
    select : {
      postId : true,
      title : true,
      content : true,
      status : true,
      updatedAt : true,
      user : {
        select : {
          username : true
        }
      }
    },
    orderBy: {
      [orderKey]: orderValue.toLocaleLowerCase(),
    }
  });

  return res.status(200).json({ data: post });
});

/** 이력서 상세 조회 */
router.get("/posts/:postId", async (req, res, next) => {
  const postId = req.params.postId;

  const post = await prisma.posts.findFirst({
    where: {
      postId: +postId,
    },
  });

  if (!post)
    return res.status(404).json({ message: "게시글이 존재하지 않습니다." });

  return res.status(200).json({ data: post });
});

/** 이력서 수정 API **/
router.patch("/posts/:postId", authMiddleware, async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user.userId;
  const body = req.body;

  const post = await prisma.posts.findFirst({
    where: {
      postId: +postId,
    },
  });

  if (!post) {
    return res.status(404).json({ message: "이력서 조회에 실패하였습니다." });
  }

  if (post.userId !== userId) {
    return res.status(404).json({ message: "잘못된 접근입니다." });
  }

  await prisma.posts.update({
    where: {
      postId: +postId,
    },
    data: {
      title: body.title,
      content: body.content,
      status: body.status,
    },
  });

  return res.status(200).json({ message: "수정되었습니다." });
});

/** 이력서 삭제 API **/
router.delete("/posts/:postId", authMiddleware, async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user.userId;

  const post = await prisma.posts.findFirst({
    where: {
      postId: +postId,
    },
  });

  if (!post) {
    return res.status(404).json({ message: "이력서 조회에 실패하였습니다." });
  }

  if (post.userId !== userId) {
    return res.status(404).json({ message: "잘못된 접근입니다." });
  }

  await prisma.posts.delete({
    where: {
      postId: +postId,
    },
  });

  return res.status(200).json({ message: "삭제되었습니다." });
});

export default router;
