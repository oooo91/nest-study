import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const dbId = process.env.DB_ID;
const password = process.env.DB_PASSWORD;

const connect = () => {
  mongoose
    .connect(
      `mongodb+srv://${dbId}:${password}@cluster0.o7lnegp.mongodb.net/shop?retryWrites=true&w=majority`,
      { dbName: "product" },
    )
    .then(() => {
      console.log("db 연결에 성공하였습니다");
    })
    .catch((error) => {
      console.log(`db 연결에 실패하였습니다. ${error}`);
    });
};

mongoose.connection.on("error", (err) => {
  console.log("db 연결 에러", err);
});

export default connect;
