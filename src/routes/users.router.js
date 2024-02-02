import express from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();
dotenv.config();

const ACCESS_TOKEN_SECRET_KEY = process.env.KEY;

/** 사용자 회원가입 API **/
router.post("/sign-up", async (req, res, next) => {
  try {
    const { email, password, confirmPassword, username } = req.body;
    const isExistUser = await prisma.users.findFirst({
      where: { email },
    });

    if (isExistUser) {
      return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "비밀번호를 6자 이상 입력하세요." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "비밀번호가 정확하지 않습니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userInfo = await prisma.$transaction(
      async (tx) => {
        const user = await tx.users.create({
          data: {
            email,
            username,
            password: hashedPassword,
          },
          select: {
            userId: true,
            email: true,
            username: true,
          },
        });

        return user;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      },
    );

    return res.status(201).json({
      message: "회원가입이 완료되었습니다.",
      data: userInfo,
    });
  } catch (err) {
    next(err);
  }
});

/** 로그인 API **/
router.post("/sign-in", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.users.findFirst({ where: { email } });

  if (!user)
    return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
  else if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "비밀번호가 틀렸습니다" });

  const token = jwt.sign({ userId: user.userId }, ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "12h",
  });

  res.cookie("authorization", `Bearer ${token}`);
  return res.status(200).json({ message: "로그인 되었습니다." });
});

/** 사용자 조회 */
router.get("/user", authMiddleware, async (req, res, next) => {
  const userId = req.user.userId;

  const user = await prisma.users.findFirst({
    where : {
      userId
    },
    select : {
      username : true,
      email : true
    }
  });
  return res.status(200).json({data : user});
})

export default router;
