import dotenv from "dotenv";
import express from "express";
import startupApp from "./startup.js";
import userApp from "./User.js";
import cors from "cors";

dotenv.config();

const mainApp = express();
mainApp.use(cors());
mainApp.use(express.json());

// `startup.js`에서 정의된 라우트들을 `/` 경로에 연결
mainApp.use("/", startupApp);

// `user.js`에서 정의된 라우트들을 `/` 경로에 연결
mainApp.use("/", userApp);

mainApp.listen(3000, () => {
  console.log("Server is running on port 3000");
});
