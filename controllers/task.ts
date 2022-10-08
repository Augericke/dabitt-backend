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
  const userId = getUserId(req);

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      categoryId,
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
