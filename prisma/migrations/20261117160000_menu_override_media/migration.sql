-- AlterTable
ALTER TABLE "MenuOverride" ADD COLUMN "hidden" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "MenuOverride" ADD COLUMN "nameOverride" TEXT;
ALTER TABLE "MenuOverride" ADD COLUMN "imagePath" TEXT;
