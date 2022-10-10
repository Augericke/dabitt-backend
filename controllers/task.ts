import { Request, Response } from "express";
import { getUserId } from "../utils/auth0";
import prisma from "../utils/prisma";

const createTask = async (req: Request, res: Response) => {
  const { description, estimateMinutes, startAt } = req.body;
  const { categoryId } = req.params;
  const userId = getUserId(req);

  const newTask = await prisma.task.create({
    data: {
      userId,
      categoryId,
      description,
      estimateMinutes,
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
  const userId = getUserId(req);

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
      userId,
      categoryId,
      OR: taskFilter,
    },
  });
  res.json(tasks);
};

const updateTask = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { description, completedAt, estimateMinutes, startAt } = req.body;
  const { id } = req.params;
  const userId = getUserId(req);

  const updatedTask = await prisma.task.update({
    where: {
      id_userId: { id, userId },
    },
    data: {
      description,
      categoryId,
      completedAt,
      estimateMinutes,
      startAt,
    },
  });
  res.json(updatedTask);
};

const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = getUserId(req);

  const deletedTasks = await prisma.task.deleteMany({
    where: {
      id,
      userId,
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
