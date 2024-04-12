import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connect from "./database/database.js";
import productRouter from "./router/router.js";
import {
  handleAddError,
  handleUpdateError,
  handleCommonError,
} from "./middlewares/error-handler.js";

const app = express();
const port = 5005;

connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//router
app.use("/api", productRouter);

app.post("/api/products", handleAddError);
app.put("/api/products/:id", handleUpdateError);
app.use(handleCommonError);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
