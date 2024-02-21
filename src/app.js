import express from "express";
import router from './routes/index.js';
import cookieParser from "cookie-parser";
import LogMiddleware from "./middleware/log.middleware.js";
import errorHandlingMiddleware from "./middleware/error-handling.middleware.js";

const app = express();
const PORT = 3018;

app.use(LogMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use('/api', router);

app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
