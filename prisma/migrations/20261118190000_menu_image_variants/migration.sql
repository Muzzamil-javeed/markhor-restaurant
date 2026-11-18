-- AlterTable
ALTER TABLE "MenuOverride" ADD COLUMN "imageSquarePath" TEXT;
ALTER TABLE "MenuOverride" ADD COLUMN "imageThumbPath" TEXT;
ALTER TABLE "MenuOverride" ADD COLUMN "imageSource" TEXT;

-- AlterTable
ALTER TABLE "MenuCustomItem" ADD COLUMN "imageSquarePath" TEXT;
ALTER TABLE "MenuCustomItem" ADD COLUMN "imageThumbPath" TEXT;
ALTER TABLE "MenuCustomItem" ADD COLUMN "imageSource" TEXT;
