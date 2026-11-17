-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "trackingToken" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'received',
    "orderType" TEXT NOT NULL,
    "timing" TEXT NOT NULL,
    "scheduledFor" DATETIME,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "address" TEXT,
    "areaLandmark" TEXT,
    "mapPinUrl" TEXT,
    "deliveryInstructions" TEXT,
    "tableNumber" TEXT,
    "partySize" INTEGER,
    "note" TEXT,
    "paymentMethod" TEXT NOT NULL,
    "voucherCode" TEXT,
    "subtotal" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "gst" INTEGER NOT NULL,
    "deliveryFee" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT,
    "unitPrice" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "lineTotal" INTEGER NOT NULL,
    "variantId" TEXT,
    "choiceIds" TEXT NOT NULL DEFAULT '[]',
    "addOnIds" TEXT NOT NULL DEFAULT '[]',
    "note" TEXT,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_code_key" ON "Order"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Order_trackingToken_key" ON "Order"("trackingToken");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
