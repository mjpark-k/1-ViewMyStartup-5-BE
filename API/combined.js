import dotenv from "dotenv";
import express from "express";
import startupApp from "./startup.js";
import userApp from "./User.js";
import cors from "cors";

dotenv.config();

const mainApp = express();
mainApp.use(cors());
mainApp.use(express.json());

mainApp.use("/", startupApp);

mainApp.use("/", userApp);

mainApp.listen(3000, () => {
  console.log("Server is running on port 3000");
});
