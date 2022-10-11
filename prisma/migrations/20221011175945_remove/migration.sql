/*
  Warnings:

  - The values [coffee,blush] on the enum `CategoryColor` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoryColor_new" AS ENUM ('default', 'default_secondary', 'forest', 'tan', 'space', 'steel', 'copper', 'pine_cone');
ALTER TABLE "Category" ALTER COLUMN "iconColor" DROP DEFAULT;
ALTER TABLE "Category" ALTER COLUMN "iconColor" TYPE "CategoryColor_new" USING ("iconColor"::text::"CategoryColor_new");
ALTER TYPE "CategoryColor" RENAME TO "CategoryColor_old";
ALTER TYPE "CategoryColor_new" RENAME TO "CategoryColor";
DROP TYPE "CategoryColor_old";
ALTER TABLE "Category" ALTER COLUMN "iconColor" SET DEFAULT 'default';
COMMIT;
