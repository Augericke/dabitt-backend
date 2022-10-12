import { Request, Response } from "express";
import { getUserId } from "../utils/auth0";
import prisma from "../utils/prisma";

const createUser = async (req: Request, res: Response) => {
  const { username } = req.body;
  const userId = getUserId(req);

  //TODO: look into unique constraint error
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
            { name: "work", iconColor: "default_secondary" },
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
  const deletedUser = await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  res.json(deletedUser);
};

export default {
  createUser,
  getUser,
  getUserPreference,
  updateUser,
  deleteUser,
};
