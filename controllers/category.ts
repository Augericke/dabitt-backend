import { Request, Response } from "express";
import { start } from "repl";
import { getUserId } from "../utils/auth0";
import prisma from "../utils/prisma";

const createCategory = async (req: Request, res: Response) => {
  const { name, iconColor } = req.body;
  const userId = getUserId(req);

  const newCategory = await prisma.category.create({
    data: {
      userId,
      name,
      iconColor,
    },
  });

  res.json(newCategory);
};

const getCategories = async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany({});
  res.json(categories);
};

const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  res.json(category);
};

const getCategoryTasks = async (req: Request, res: Response) => {
  const startTime = new Date(req.query.startTime as string);
  const endTime = new Date(req.query.endTime as string);
  const isFuture = parseInt(req.query.isFuture as string) || 0;
  const isCurrent = parseInt(req.query.isCurrent as string) || 0;

  const userId = getUserId(req);

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
        userId,
      },
    });

    res.json(usersCategories);
  }
};

const updateCategory = async (req: Request, res: Response) => {
  const { name, iconColor } = req.body;
  const { id } = req.params;
  const userId = getUserId(req);

  const updatedCategory = await prisma.category.update({
    where: {
      id_userId: { id, userId },
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
  const userId = getUserId(req);

  const deletedTasks = prisma.task.deleteMany({
    where: {
      categoryId: id,
      userId,
    },
  });

  const deletedCategories = prisma.category.deleteMany({
    where: {
      id,
      userId,
    },
  });

  // In the future this cascading delete could be done by setting referential actions https://www.prisma.io/docs/concepts/components/prisma-schema/relations/referential-actions
  // however, at the moment this feature is still just in preview
  const transaction = await prisma.$transaction([
    deletedTasks,
    deletedCategories,
  ]);

  res.json(transaction);
};

export default {
  createCategory,
  getCategories,
  getCategoryTasks,
  getCategory,
  updateCategory,
  deleteCategory,
};
