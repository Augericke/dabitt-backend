import { Request, Response } from "express";
import { getAuthId } from "../utils/auth0";
import prisma from "../utils/prisma";

const createCategory = async (req: Request, res: Response) => {
  const { name, iconColor } = req.body;
  const authId = getAuthId(req);

  const newCategory = await prisma.category.create({
    data: {
      authId,
      name,
      iconColor,
    },
  });

  res.json(newCategory);
};

const getCategories = async (req: Request, res: Response) => {
  const authId = getAuthId(req);
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      iconColor: true,
    },
    where: {
      authId,
    },
  });
  res.json(categories);
};

const getCategoryTasks = async (req: Request, res: Response) => {
  const startTime = new Date(req.query.startTime as string);
  const endTime = new Date(req.query.endTime as string);
  const isFuture = parseInt(req.query.isFuture as string) || 0;
  const isCurrent = parseInt(req.query.isCurrent as string) || 0;

  const authId = getAuthId(req);

  if (startTime && endTime) {
    // Filter tasks based on whether current day or not
    let taskFilter;
    if (isCurrent) {
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
            lt: endTime,
          },
        },
        {
          completedAt: null,
          startAt: null,
        },
      ];
    } else if (isFuture) {
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
    } else {
      taskFilter = [
        {
          completedAt: {
            gte: startTime,
            lte: endTime,
          },
        },
      ];
    }

    // Include unfinished tasks except those with a later startAt
    const usersCategories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        iconColor: true,
        tasks: {
          select: {
            id: true,
            description: true,
            createdAt: true,
            completedAt: true,
            startAt: true,
            estimateMinutes: true,
          },
          where: {
            OR: taskFilter,
          },
        },
      },
      where: {
        authId,
      },
    });

    res.json(usersCategories);
  }
};

const updateCategory = async (req: Request, res: Response) => {
  const { name, iconColor } = req.body;
  const { id } = req.params;
  const authId = getAuthId(req);

  const updatedCategory = await prisma.category.update({
    where: {
      id_authId: { id, authId },
    },
    data: {
      name,
      iconColor,
    },
  });

  res.json(updatedCategory);
};

const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authId = getAuthId(req);

  const deletedCategories = await prisma.category.deleteMany({
    where: {
      id,
      authId,
    },
  });
  res.json(deletedCategories);
};

export default {
  createCategory,
  getCategories,
  getCategoryTasks,
  updateCategory,
  deleteCategory,
};
