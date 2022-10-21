import { Request, Response } from "express";
import { getAuthId } from "../utils/auth0";
import prisma from "../utils/prisma";

const createOrConnectUser = async (req: Request, res: Response) => {
  const { username } = req.body;
  const authId = getAuthId(req);

  const newUser = await prisma.user.upsert({
    where: {
      authId,
    },
    update: {},
    create: {
      authId,
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
  const authId = getAuthId(req);

  const user = await prisma.user.findUnique({
    include: {
      userPreference: {
        select: {
          preferedTheme: true,
        },
      },
    },
    where: {
      authId,
    },
  });
  res.json(user);
};

const getUserPreference = async (req: Request, res: Response) => {
  const authId = getAuthId(req);

  const preference = await prisma.userPreference.findUnique({
    where: {
      authId,
    },
  });

  res.json(preference);
};

const updateUser = async (req: Request, res: Response) => {
  const { completedSetup, username, preferedTheme } = req.body;
  const authId = getAuthId(req);

  const updatedUser = await prisma.user.update({
    where: {
      authId,
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
  const authId = getAuthId(req);
  const deletedUser = await prisma.user.delete({
    where: {
      authId,
    },
  });

  res.json(deletedUser);
};

export default {
  createOrConnectUser,
  getUser,
  getUserPreference,
  updateUser,
  deleteUser,
};
