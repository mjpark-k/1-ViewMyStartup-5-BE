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
    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";
    const includeRanking = req.query.includeRanking === "true";

    const offset = (page - 1) * limit;

    const keywordInput = req.query.keyword;
    let searchQuery = {};

    if (Array.isArray(keywordInput)) {
      searchQuery = { name: { in: keywordInput } };
    } else if (typeof keywordInput === "string" && keywordInput) {
      searchQuery = { name: { contains: keywordInput } };
    }

    let orderBy = {};
    if (sortBy === "actualInvest") {
      orderBy = { actualInvest: sortOrder };
    } else if (sortBy === "simInvest") {
      orderBy = { simInvest: sortOrder };
    } else if (sortBy === "employees") {
      orderBy = { employees: sortOrder };
    } else if (sortBy === "revenue") {
      orderBy = { revenue: sortOrder };
    } else if (sortBy === "count") {
      orderBy = { count: sortOrder };
    } else if (sortBy === "createdAt") {
      orderBy = { createdAt: sortOrder };
    } else if (sortBy === "updatedAt") {
      orderBy = { updatedAt: sortOrder };
    }

    // 1. 필터링된 데이터를 가져옴
    const startups = await startup_prisma.startup.findMany({
      where: searchQuery,
      skip: offset,
      take: limit,
      orderBy: orderBy,
      include: {
        investments: true, // 필요에 따라 투자자 목록을 포함
      },
    });

    let startupsWithRankings = startups;

    if (includeRanking) {
      // 2. 전체 데이터를 가져와서 랭킹을 계산
      const allStartups = await startup_prisma.startup.findMany({
        orderBy: orderBy,
        select: { id: true }, // 랭킹을 계산하기 위해 ID만 선택
      });

      // 3. 전체 데이터에서 랭킹을 매김
      const rankings = allStartups.map((startup, index) => ({
        id: startup.id,
        rank: index + 1, // 랭킹은 1부터 시작
      }));

      // 4. 필터링된 데이터에 랭킹을 포함시킴
      startupsWithRankings = startups.map((startup) => {
        const rank = rankings.find((r) => r.id === startup.id)?.rank;
        return { ...startup, rank: rank };
      });

      // 5. 특정 스타트업의 순위를 기준으로 앞뒤 2순위를 포함한 데이터를 가져옴
      const startupRanks = startupsWithRankings.map((s) => s.rank);
      const minRank = Math.min(...startupRanks);
      const maxRank = Math.max(...startupRanks);

      const extendedRankings = rankings.filter(
        (r) => r.rank >= minRank - 2 && r.rank <= maxRank + 2
      );

      const extendedStartups = await startup_prisma.startup.findMany({
        where: {
          id: { in: extendedRankings.map((r) => r.id) },
        },
        orderBy: orderBy,
        include: {
          investments: true,
        },
      });

      // 6. extendedStartups에 해당하는 랭킹 정보 추가
      startupsWithRankings = extendedStartups.map((startup) => {
        const rank = rankings.find((r) => r.id === startup.id)?.rank;
        return { ...startup, rank: rank };
      });
    }

    const totalStartup = await startup_prisma.startup.count({
      where: searchQuery,
    });
    const totalPages = Math.ceil(totalStartup / limit);

    res.status(200).send({
      data: startupsWithRankings,
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
