-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('light', 'dark', 'lobby', 'sea', 'cappuccino');

-- CreateEnum
CREATE TYPE "CategoryColor" AS ENUM ('default', 'default_secondary', 'forest', 'tan', 'space', 'steel', 'copper', 'pine_cone');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedSetup" BOOLEAN NOT NULL DEFAULT false,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "preferedTheme" "Theme" NOT NULL DEFAULT 'light',
    "authId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iconColor" "CategoryColor" NOT NULL DEFAULT 'default',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authId" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startAt" TIMESTAMP(3),
    "estimateMinutes" INTEGER NOT NULL DEFAULT 15,
    "authId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_authId_key" ON "User"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_authId_key" ON "User"("id", "authId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_authId_key" ON "UserPreference"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_id_authId_key" ON "Category"("id", "authId");

-- CreateIndex
CREATE UNIQUE INDEX "Task_id_authId_key" ON "Task"("id", "authId");

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_authId_fkey" FOREIGN KEY ("authId") REFERENCES "User"("authId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_authId_fkey" FOREIGN KEY ("authId") REFERENCES "User"("authId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_authId_fkey" FOREIGN KEY ("authId") REFERENCES "User"("authId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
