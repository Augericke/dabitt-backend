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

const getTasks = async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany({});
  res.json(tasks);
};

const getTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  const task = await prisma.task.findUnique({
    where: {
      id,
    },
  });
  res.json(task);
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
  const { description, categoryId, completedAt } = req.body;
  const { id } = req.params;

  const updatedTask = await prisma.task.update({
    where: {
      id,
    },
    data: {
      description,
      categoryId,
      completedAt,
    },
  });

  res.json(updatedTask);
};

const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedTasks = await prisma.task.deleteMany({
    where: {
      id,
    },
  });

  res.json(deletedTasks);
};

export default {
  createTask,
  getTasks,
  getTask,
  getUsersTasks,
  updateTask,
  deleteTask,
};
