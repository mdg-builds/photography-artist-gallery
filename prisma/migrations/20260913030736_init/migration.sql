-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleEs" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "descEs" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bio" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "name" TEXT NOT NULL,
    "roleEn" TEXT NOT NULL,
    "roleEs" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL,
    "bodyEs" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "brand" TEXT NOT NULL DEFAULT 'Sin Pedir Permiso',
    "heroSubtitleEn" TEXT NOT NULL DEFAULT '',
    "heroSubtitleEs" TEXT NOT NULL DEFAULT '',
    "heroCreditEn" TEXT NOT NULL DEFAULT '',
    "heroCreditEs" TEXT NOT NULL DEFAULT '',
    "heroImageUrl" TEXT,
    "statementEn" TEXT NOT NULL DEFAULT '',
    "statementEs" TEXT NOT NULL DEFAULT '',
    "footerCreditEn" TEXT NOT NULL DEFAULT '',
    "footerCreditEs" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
