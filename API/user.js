import dotenv from "dotenv";
import express from "express";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const user_prisma = new PrismaClient();
const user = express();

user.get("/user", async (req, res) => {
  try {
    const users = await user_prisma.user.findMany();
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
  }
});

user.listen(3000, () => {
  console.log("Server is running");
});
