import { Request, Response } from "express";
import { getUserId } from "../utils/auth0";
import prisma from "../utils/prisma";

const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  const userId = getUserId(req);

  const newCategory = await prisma.category.create({
    data: {
      userId,
      name,
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

const getUsersCategories = async (req: Request, res: Response) => {
  const userId = getUserId(req);
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
          estimateMinutes: true,
        },
      },
    },
    where: {
      userId,
    },
  });
  res.json(usersCategories);
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
  getUsersCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
