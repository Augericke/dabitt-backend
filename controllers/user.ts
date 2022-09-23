import { Request, Response } from "express";
import prisma from "../utils/prisma";

const createUser = async (req: Request, res: Response) => {
  const { username } = req.body;

  const newUser = await prisma.user.create({
    data: {
      username,
      userPreference: {
        create: {
          preferedTheme: "CLASSIC",
        },
      },
    },
  });

  res.json(newUser);
};

const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: {
      userPreference: {
        select: {
          id: true,
          preferedTheme: true,
        },
      },
    },
  });
  res.json(users);
};

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    include: {
      userPreference: {
        select: {
          preferedTheme: true,
        },
      },
    },
    where: {
      id,
    },
  });
  res.json(user);
};

const getUserPreference = async (req: Request, res: Response) => {
  const { id } = req.params;

  const preference = await prisma.userPreference.findUnique({
    where: {
      id,
    },
  });

  res.json(preference);
};

const updateUser = async (req: Request, res: Response) => {
  const { username } = req.body;
  const { id } = req.params;

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      username,
    },
  });

  res.json(updatedUser);
};

const updateUserPreference = async (req: Request, res: Response) => {
  const { preferedTheme } = req.body;
  const { id } = req.params;

  const updatedPreferences = await prisma.userPreference.update({
    where: {
      id,
    },
    data: {
      preferedTheme,
    },
  });
  res.json(updatedPreferences);
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedTasks = prisma.category.deleteMany({
    where: {
      userId: id,
    },
  });

  const deletedCategories = prisma.category.deleteMany({
    where: {
      userId: id,
    },
  });

  const deletedPreferences = prisma.userPreference.delete({
    where: {
      userId: id,
    },
  });

  const deletedUser = prisma.user.delete({
    where: {
      id,
    },
  });

  // In the future this cascading delete could be done by setting referential actions https://www.prisma.io/docs/concepts/components/prisma-schema/relations/referential-actions
  // however, at the moment this feature is still just in preview
  const transaction = await prisma.$transaction([
    deletedTasks,
    deletedCategories,
    deletedPreferences,
    deletedUser,
  ]);

  res.json(transaction);
};

export default {
  createUser,
  getUsers,
  getUser,
  getUserPreference,
  updateUser,
  updateUserPreference,
  deleteUser,
};
