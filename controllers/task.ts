import { Request, Response } from "express";
import { getUserId } from "../utils/auth0";
import prisma from "../utils/prisma";

const createTask = async (req: Request, res: Response) => {
  const { description, categoryId, estimateMinutes } = req.body;
  const userId = getUserId(req);

  const newTask = await prisma.task.create({
    data: {
      userId,
      categoryId,
      description,
      estimateMinutes,
    },
  });

  res.json(newTask);
};

const getUsersTasks = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const usersTasks = await prisma.task.findMany({
    where: {
      userId,
    },
  });
  res.json(usersTasks);
};

const updateTask = async (req: Request, res: Response) => {
  const { description, categoryId, completedAt, estimateMinutes, startAt } =
    req.body;
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
  getUsersTasks,
  updateTask,
  deleteTask,
};
