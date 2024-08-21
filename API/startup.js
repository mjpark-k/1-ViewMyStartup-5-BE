import dotenv from "dotenv";
import express from "express";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const startup_prisma = new PrismaClient();
const startup = express();
startup.use(express.json());
startup.get("/startups", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "";
    const sortOder = req.query.sortOder === "desc" ? "desc" : "asc";

    const offset = (page - 1) * limit;
    const keywordInput = req.query.keyword;
    let searchQuery = {};

    if (Array.isArray(keywordInput)) {
      searchQuery = { name: { in: keywordInput } };  // 여러 키워드에 대한 검색
    } else if (typeof keywordInput === 'string' && keywordInput) {
      searchQuery = { name: { contains: keywordInput } };  // 단일 키워드에 대한 검색
    }

    // 전체 데이터에 대해 정렬 기준에 따라 랭킹 계산
    let orderBy = {};
    if (sortBy === "actualInvest") {
      orderBy = { actualInvest: sortOder };
    } else if (sortBy === "simInvest") {
      orderBy = { simInvest: sortOder };
    } else if (sortBy === "employees") {
      orderBy = { employees: sortOder };
    } else if (sortBy === "revenue") {
      orderBy = { revenue: sortOder };
    } else if (sortBy === "count") {
      orderBy = { count: sortOder };
    } else if (sortBy === "category") {
      orderBy = { category: sortOder };
    } else if (sortBy === "createdAt") {
      orderBy = { createdAt: sortOder };
    } else if (sortBy === "updatedAt") {
      orderBy = { updatedAt: sortOder };
    }

    // 전체 데이터 가져오기
    const allStartups = await startup_prisma.startup.findMany({
      orderBy: orderBy,
    });

    // 랭킹 부여
    const rankedStartups = allStartups.map((startup, index) => ({
      ...startup,
      rank: index + 1, // 랭킹 부여
    }));

    // 키워드로 필터링 및 페이징 처리
    const filteredStartups = rankedStartups.filter((startup) =>
      startup.name.includes(keywordInput)
    );

    const paginatedStartups = filteredStartups.slice(offset, offset + limit);

    const totalStartup = filteredStartups.length;
    const totalPages = Math.ceil(totalStartup / limit);

    // 응답
    res.status(200).send({
      data: paginatedStartups,
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

startup.get("/startups/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const startup = await startup_prisma.startup.findUnique({
      where: { id },
    });

    if (startup) {
      await startup_prisma.startup.update({
        where: { id },
        data: {
          count: {
            increment: 1,
          },
        },
      });
    }

    res.status(200).send(startup);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

startup.post("/startups", async (req, res) => {
  try {
    const {
      name,
      actualInvest,
      simInvest,
      employees,
      revenue,
      description,
      count,
      category,
    } = req.body;

    const startup = await startup_prisma.startup.create({
      data: {
        name,
        actualInvest,
        simInvest,
        employees,
        revenue,
        description,
        count,
        category,
      },
    });
    res.status(200).send(startup);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

startup.patch("/startups/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      actualInvest,
      simInvest,
      employees,
      revenue,
      description,
      count,
      category,
    } = req.body;
    const startup = await startup_prisma.startup.update({
      where: { id },
      data: {
        name,
        actualInvest,
        simInvest,
        employees,
        revenue,
        description,
        count,
        category,
      },
    });
    res.status(200).send(startup);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

startup.delete("/startups/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const startup = await startup_prisma.startup.delete({ where: { id } });
    res.status(200).send(startup);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

export default startup;
