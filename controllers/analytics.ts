import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { getAuthId } from "../utils/auth0";
import prisma from "../utils/prisma";

const getCalendarCompleted = async (req: Request, res: Response) => {
  const categoryId = req.query.categoryId as string;
  const tz = req.query.tz as string;
  const authId = getAuthId(req);

  let aggregatedData;
  if (categoryId) {
    aggregatedData = await prisma.$queryRaw(
      Prisma.sql`
    SELECT
      DATE(("completedAt" at time zone 'UTC') at time zone ${tz}) AS day,
      SUM("estimateMinutes") AS value
    FROM "Task"
    WHERE
      ("completedAt" at time zone 'UTC') at time zone ${tz} >= (CURRENT_DATE at time zone 'UTC') at time zone ${tz} - interval '182 day'
      AND "categoryId" = ${categoryId}
      AND "authId" = ${authId}
    GROUP BY day
    `,
    );
  } else {
    aggregatedData = await prisma.$queryRaw(
      Prisma.sql`
    SELECT
      DATE(("completedAt" at time zone 'UTC') at time zone ${tz}) AS day,
      SUM("estimateMinutes") AS value
    FROM "Task"
    WHERE
      ("completedAt" at time zone 'UTC') at time zone ${tz} >= (CURRENT_DATE at time zone 'UTC') at time zone ${tz} - interval '182 day'
      AND "authId" = ${authId}
    GROUP BY day
    `,
    );
  }

  const jsonData = JSON.stringify(aggregatedData, (key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );

  return res.send(jsonData);
};

const getWeekCompleted = async (req: Request, res: Response) => {
  const authId = getAuthId(req);
  const tz = req.query.tz as string;

  const aggregatedData = await prisma.$queryRaw(
    Prisma.sql`
    SELECT
      "categoryId",
      date_trunc('day', cal)::date AS day,
      coalesce(SUM("estimateMinutes"), 0) AS value
    FROM generate_series
      ( (CURRENT_DATE at time zone 'UTC') at time zone ${tz} - interval '6 day'
      , (CURRENT_DATE at time zone 'UTC') at time zone ${tz}
      , '1 day'::interval) cal
    LEFT JOIN "Task" 
      ON DATE(("completedAt" at time zone 'UTC') at time zone ${tz}) = date_trunc('day', cal)::date
    WHERE
      "authId" = ${authId} OR "authId" IS NULL
    GROUP BY "categoryId", "day"
    ORDER BY day
    `,
  );

  const jsonData = JSON.stringify(aggregatedData, (key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );

  return res.send(jsonData);
};

export default {
  getCalendarCompleted,
  getWeekCompleted,
};
