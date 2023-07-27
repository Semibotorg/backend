-- CreateTable
CREATE TABLE "UserAccessToken" (
    "id" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "encryptedToken" TEXT NOT NULL,
    "expires_in" INTEGER NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAccessToken_pkey" PRIMARY KEY ("id")
);
