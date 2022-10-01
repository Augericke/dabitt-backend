import { Request, Response } from "express";
import { getUserId } from "../utils/auth0";
import prisma from "../utils/prisma";

const createUser = async (req: Request, res: Response) => {
  const { username } = req.body;
  const userId = getUserId(req);

  const newUser = await prisma.user.upsert({
    where: {
      id: userId,
    },
    update: {},
    create: {
      id: userId,
      completedSetup: false,
      username,
      categories: {
        createMany: {
          data: [
            { name: "personal", iconColor: "default" },
            { name: "work", iconColor: "forest" },
          ],
        },
      },
      userPreference: {
        create: {
          preferedTheme: "light",
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
  const userId = getUserId(req);

  const user = await prisma.user.findUnique({
    include: {
      userPreference: {
        select: {
          preferedTheme: true,
        },
      },
    },
    where: {
      id: userId,
    },
  });
  res.json(user);
};

const getUserPreference = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const preference = await prisma.userPreference.findUnique({
    where: {
      id: userId,
    },
  });

  res.json(preference);
};

const updateUser = async (req: Request, res: Response) => {
  const { completedSetup, username, preferedTheme } = req.body;
  const userId = getUserId(req);

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      completedSetup,
      username,
      userPreference: {
        update: {
          preferedTheme,
        },
      },
    },
  });

  res.json(updatedUser);
};

const deleteUser = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const deletedTasks = prisma.category.deleteMany({
    where: {
      userId,
    },
  });

  const deletedCategories = prisma.category.deleteMany({
    where: {
      userId,
    },
  });

  const deletedPreferences = prisma.userPreference.delete({
    where: {
      userId,
    },
  });

  const deletedUser = prisma.user.delete({
    where: {
      id: userId,
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
  deleteUser,
};
