import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { getUserId } from "../utils/auth0";
import prisma from "../utils/prisma";

const getCalendarCompleted = async (req: Request, res: Response) => {
  const categoryId = req.query.categoryId as string;
  const userId = getUserId(req);

  // TODO: Look into a more dry solution for dynamic query params within prisma
  let aggregatedData;
  if (categoryId) {
    aggregatedData = await prisma.$queryRaw(
      Prisma.sql`
    SELECT
      DATE("completedAt") AS day,
      SUM("estimateMinutes") AS value
    FROM "Task"
    WHERE
      DATE("completedAt") IS NOT NULL
      AND "completedAt" >= CURRENT_DATE - interval '182 day'
      AND "categoryId" = ${categoryId}
      AND "userId" = ${userId}
    GROUP BY day
    `,
    );
  } else {
    aggregatedData = await prisma.$queryRaw(
      Prisma.sql`
    SELECT
      DATE("completedAt") AS day,
      SUM("estimateMinutes") AS value
    FROM "Task"
    WHERE
      DATE("completedAt") IS NOT NULL
      AND "completedAt" >= CURRENT_DATE - interval '182 day'
      AND "userId" = ${userId}
    GROUP BY day
    `,
    );
  }

  const jsonData = JSON.stringify(aggregatedData, (key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );
  return res.send(jsonData);
};

export default {
  getCalendarCompleted,
};
