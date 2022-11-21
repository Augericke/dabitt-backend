import { Request, Response } from "express";
import { getAuthId } from "../utils/auth0";
import prisma from "../utils/prisma";

const createTask = async (req: Request, res: Response) => {
  const { description, estimateMinutes, externalURL, startAt } = req.body;
  const { categoryId } = req.params;
  const authId = getAuthId(req);

  const newTask = await prisma.task.create({
    data: {
      authId,
      categoryId,
      description,
      estimateMinutes,
      externalURL,
      startAt,
    },
  });

  res.json(newTask);
};

const getTasks = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const startTime = new Date(req.query.startTime as string);
  const endTime = new Date(req.query.endTime as string);
  const displayType = req.query.displayType as string;
  const authId = getAuthId(req);

  let taskFilter;
  switch (displayType) {
    case "current":
      taskFilter = [
        {
          completedAt: {
            gte: startTime,
            lte: endTime,
          },
        },
        // Show all uncompleted tasks that have started at before end time
        {
          completedAt: null,
          startAt: {
            lt: endTime,
          },
        },
        {
          completedAt: null,
          startAt: null,
        },
      ];
      break;
    case "future":
      taskFilter = [
        {
          completedAt: {
            gte: startTime,
            lte: endTime,
          },
        },
        {
          completedAt: null,
          startAt: {
            gte: startTime,
            lte: endTime,
          },
        },
      ];
      break;
    case "past":
      taskFilter = [
        {
          completedAt: {
            gte: startTime,
            lte: endTime,
          },
        },
      ];
      break;
    default:
      taskFilter = [
        {
          completedAt: {
            gte: startTime,
            lte: endTime,
          },
        },
      ];
  }

  const tasks = await prisma.task.findMany({
    where: {
      authId,
      categoryId,
      OR: taskFilter,
    },
  });
  res.json(tasks);
};

const updateTask = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { description, completedAt, estimateMinutes, startAt, externalURL } =
    req.body;
  const { id } = req.params;
  const authId = getAuthId(req);

  const updatedTask = await prisma.task.update({
    where: {
      id_authId: { id, authId },
    },
    data: {
      description,
      categoryId,
      completedAt,
      estimateMinutes,
      startAt,
      externalURL,
    },
  });
  res.json(updatedTask);
};

const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authId = getAuthId(req);

  const deletedTasks = await prisma.task.deleteMany({
    where: {
      id,
      authId,
    },
  });

  res.json(deletedTasks);
};

export default {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
