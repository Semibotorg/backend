/*
  Warnings:

  - You are about to drop the column `avatar_url` on the `Tiers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tiers" DROP COLUMN "avatar_url";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "tier_id" TEXT NOT NULL,
    "discord_user_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guild_id" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);
