-- CreateTable
CREATE TABLE "MenuCustomItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "imagePath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MenuCustomItem_slug_key" ON "MenuCustomItem"("slug");

-- CreateIndex
CREATE INDEX "MenuCustomItem_categoryId_idx" ON "MenuCustomItem"("categoryId");

-- CreateIndex
CREATE INDEX "MenuCustomItem_hidden_idx" ON "MenuCustomItem"("hidden");
