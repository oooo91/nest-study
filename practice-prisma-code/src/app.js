import express from "express";
import cookieParser from "cookie-parser";
import UsersRouter from "./routes/users.router.js";
import LogMiddleware from "./middleware/log.middleware.js";
import errorHandlingMiddleware from "./middleware/error-handling.middleware.js";
import PostsRouter from "./routes/posts.router.js";

const app = express();
const PORT = 3018;

app.use(LogMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use("/api", [UsersRouter, PostsRouter]);

app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
