import dotenv from "dotenv";
import { prisma } from "../utils/prisma/index.js";
import jwt from "jsonwebtoken";

dotenv.config();
const ACCESS_TOKEN_SECRET_KEY = process.env.KEY;

export default async function (req, res, next) {
  
  try {
    const { authorization } = req.cookies;

    if (!authorization) {
      throw new Error("토큰이 존재하지 않습니다.");
    }

    const [tokenType, token] = authorization.split(" ");

    if (tokenType !== "Bearer") {
      throw new Error("토큰 타입이 일치하지 않습니다.");
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);
    const userId = decodedToken.userId;

    const user = await prisma.users.findFirst({
      where: { userId: +userId },
    });

    if (!user) {
      throw new Error("토큰 사용자가 존재하지 않습니다.");
    }

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("authorization");

    switch (error.name) {
      case "TokenExpiredError":
        error.message = "토큰이 만료되었습니다.";
        error.status = 401;
        break;

      case "JsonWebTokenError":
        error.message = "토큰이 조작되었습니다.";
        error.status = 401;
        break;

      default:
        error.message = "비정상적인 요청입니다.";
        error.status = 401;
    }

    return res.status(error.status).json({ message: error.message });
  }
}