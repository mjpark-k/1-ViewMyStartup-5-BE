import dotenv from "dotenv";
import express from "express";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const startup_prisma = new PrismaClient();
const startup = express();

startup.get("/startup", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const keyword = req.query.keyword || "";
    const sortBy = req.query.sortBy || "";
    const sortOder = req.query.sortOder === "desc" ? "desc" : "asc";

    const offset = (page - 1) * limit;

    const searchQuery = keyword ? { name: { contains: keyword } } : {};

    let orderBy = {};
    if (sortBy === "actualInvest") {
      orderBy = { actualInvest: sortOder };
    } else if (sortBy === "simInvest") {
      orderBy = { simInvest: sortOder };
    } else if (sortBy === "employees") {
      orderBy = { employees: sortOder };
    }

    const startups = await startup_prisma.startup.findMany({
      where: searchQuery,
      skip: offset,
      take: limit,
      orderBy: orderBy,
      include: {
        // 투자자 목록도 가지고옴
        investments: true,
      },
    });

    const totalStartup = await startup_prisma.startup.count({
      where: searchQuery,
    });
    const totalPages = Math.ceil(totalStartup / limit);

    res.status(200).send({
      data: startups,
      meta: {
        total: totalStartup,
        page: page,
        limit: limit,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

startup.listen(3000, () => {
  console.log("Server is running");
});
