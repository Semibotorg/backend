-- CreateTable
CREATE TABLE "UserAccessToken" (
    "discord_user_id" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "encryptedToken" TEXT NOT NULL,
    "expires_in" INTEGER NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAccessToken_pkey" PRIMARY KEY ("discord_user_id")
);

-- CreateTable
CREATE TABLE "Tiers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "made_by" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "premium_discord_channels" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "premium_discord_roles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "premium_additional_benefits" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guild_id" TEXT NOT NULL,

    CONSTRAINT "Tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethods" (
    "guild_id" TEXT NOT NULL,
    "discord_user_id" TEXT NOT NULL,
    "connected_stripe_account_id" TEXT,
    "connected_paypal_access_token" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentMethods_pkey" PRIMARY KEY ("guild_id")
);
