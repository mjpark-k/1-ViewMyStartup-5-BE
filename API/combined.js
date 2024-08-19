import dotenv from "dotenv";
import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

dotenv.config();

const startup_prisma = new PrismaClient();
const startup = express();
startup.use(express.json());
const user_prisma = new PrismaClient();
const user = express();
user.use(express.json());
startup.use(
  cors({
    origin: ["http://localhost:3000", "https://startup-38qa.onrender.com"],
  })
);
user.use(
  cors({
    origin: ["http://localhost:3000", "https://startup-38qa.onrender.com"],
  })
);
startup.get("/startups", async (req, res) => {
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
        investments: true /** 투자자 목록도 가지고옴 필요 없다 생각하면 삭제할 예정 */,
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

user.get("/startups/:id/users", async (req, res) => {
  try {
    const { id } = req.params;
    const users = await user_prisma.user.findMany({
      where: { startupId: id },
    });
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

user.post("/startups/:id/users", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, InvestAmount, comment, password } = req.body;

    const [user, updatedStartup] = await user_prisma.$transaction([
      user_prisma.user.create({
        data: {
          startupId: id,
          name,
          InvestAmount,
          comment,
          password,
        },
      }),
      user_prisma.startup.update({
        // 스타트업 데이터에 투자 금액를 추가
        where: {
          id: id,
        },
        data: {
          simInvest: {
            increment: InvestAmount,
          },
        },
      }),
    ]);

    res.status(200).send({ user, updatedStartup });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

user.patch("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const existingUser = await user_prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).send({ error: "User not found" });
    }

    const { name, InvestAmount, comment, password } = req.body;

    const difference = InvestAmount - existingUser.InvestAmount;

    const user = await user_prisma.user.update({
      where: { id },
      data: { name, InvestAmount, comment, password },
    });

    // 여기서부터 투자금액 차이를 통해서 -해줄지, + 해줄지 정해서 업데이트 합니다.
    if (difference > 0) {
      await user_prisma.startup.update({
        where: {
          id: existingUser.startupId,
        },
        data: {
          simInvest: {
            increment: difference,
          },
        },
      });
    } else if (difference < 0) {
      await user_prisma.startup.update({
        where: {
          id: existingUser.startupId,
        },
        data: {
          simInvest: {
            decrement: -difference,
          },
        },
      });
    }

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

user.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const userToDelete = await user_prisma.user.findUnique({
      where: { id },
      select: { InvestAmount: true, startupId: true },
    });

    if (!userToDelete) {
      return res.status(404).send({ error: "User not found" });
    }

    const user = await user_prisma.user.delete({
      where: { id },
    });

    await user_prisma.startup.update({
      // 투자자 삭제 -> 투자금액 회수
      where: {
        id: userToDelete.startupId,
      },
      data: {
        simInvest: {
          decrement: userToDelete.InvestAmount, // 투자 금액만큼 감소
        },
      },
    });

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

startup.listen(3000, () => {
  console.log("Server is running");
});
