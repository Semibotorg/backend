/*
  Warnings:

  - You are about to drop the column `premium_discord_channels` on the `Tiers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tiers" DROP COLUMN "premium_discord_channels",
ALTER COLUMN "premium_discord_roles" DROP DEFAULT;
