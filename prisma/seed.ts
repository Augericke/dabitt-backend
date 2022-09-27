import prisma from "../utils/prisma";

async function main() {
  await prisma.user.createMany({
    data: [
      {
        id: "asf31cvz21",
        completedSetup: false,
        username: "augericke",
      },
      {
        id: "as11cva1asd",
        completedSetup: false,
        username: "ted",
      },
      {
        id: "bh11cva51",
        completedSetup: false,
        username: "hank",
      },
    ],
  });

  await prisma.userPreference.createMany({
    data: [
      {
        userId: "asf31cvz21",
        preferedTheme: "light",
      },
      {
        userId: "as11cva1asd",
        preferedTheme: "dark",
      },
      {
        userId: "bh11cva51",
        preferedTheme: "lobby",
      },
    ],
  });

  await prisma.category.createMany({
    data: [
      {
        id: "5as53112",
        userId: "asf31cvz21",
        name: "Personal",
      },
      {
        id: "5as267324",
        userId: "asf31cvz21",
        name: "Work",
      },
      {
        id: "5as2d",
        userId: "as11cva1asd",
        name: "Health",
      },
      {
        id: "14gas2d",
        userId: "as11cva1asd",
        name: "Hobbies",
      },
      {
        id: "1413ad",
        userId: "as11cva1asd",
        name: "Work",
      },
      {
        id: "123ad",
        userId: "bh11cva51",
        name: "School",
      },
    ],
  });

  await prisma.task.createMany({
    data: [
      {
        userId: "asf31cvz21",
        categoryId: "5as53112",
        description: "walk the dog",
      },
      {
        userId: "asf31cvz21",
        categoryId: "5as53112",
        description: "cook dinner",
      },
      {
        userId: "asf31cvz21",
        categoryId: "5as53112",
        description: "make bed",
      },
      {
        userId: "asf31cvz21",
        categoryId: "5as267324",
        description: "write code",
      },
      {
        userId: "as11cva1asd",
        categoryId: "5as2d",
        description: "go for a run",
      },
      {
        userId: "as11cva1asd",
        categoryId: "5as2d",
        description: "play pickup",
      },
      {
        userId: "as11cva1asd",
        categoryId: "1413ad",
        description: "photograph bird",
      },
      {
        userId: "bh11cva51",
        categoryId: "123ad",
        description: "finish hw",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
