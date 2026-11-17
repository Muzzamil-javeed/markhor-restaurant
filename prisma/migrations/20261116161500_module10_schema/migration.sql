-- RedefineTables for Module 10 schema alignment + new models.

PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "trackingToken" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'received',
    "type" TEXT NOT NULL,
    "timing" TEXT NOT NULL DEFAULT 'asap',
    "scheduledFor" DATETIME,
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "area" TEXT,
    "mapPinUrl" TEXT,
    "deliveryInstructions" TEXT,
    "tableNo" TEXT,
    "partySize" INTEGER,
    "note" TEXT,
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "voucherCode" TEXT,
    "subtotal" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "gst" INTEGER NOT NULL,
    "deliveryFee" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "new_Order" (
    "id", "code", "trackingToken", "status", "type", "timing", "scheduledFor",
    "customerName", "phone", "email", "address", "area", "mapPinUrl",
    "deliveryInstructions", "tableNo", "partySize", "note", "paymentMethod",
    "paymentStatus", "voucherCode", "subtotal", "discount", "gst", "deliveryFee",
    "total", "createdAt", "updatedAt"
)
SELECT
    "id", "code", "trackingToken", "status", "orderType", "timing", "scheduledFor",
    "customerName", "customerPhone", "customerEmail", "address", "areaLandmark", "mapPinUrl",
    "deliveryInstructions", "tableNumber", "partySize", "note", "paymentMethod",
    'unpaid', "voucherCode", "subtotal", "discount", "gst", "deliveryFee",
    "total", "createdAt", "updatedAt"
FROM "Order";

DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";

CREATE UNIQUE INDEX "Order_code_key" ON "Order"("code");
CREATE UNIQUE INDEX "Order_trackingToken_key" ON "Order"("trackingToken");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Order_type_idx" ON "Order"("type");

CREATE TABLE "new_OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "variantLabel" TEXT,
    "choices" TEXT NOT NULL DEFAULT '[]',
    "addOns" TEXT NOT NULL DEFAULT '[]',
    "unitPrice" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "lineTotal" INTEGER NOT NULL,
    "note" TEXT,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_OrderItem" (
    "id", "orderId", "itemId", "name", "variantLabel", "choices", "addOns",
    "unitPrice", "qty", "lineTotal", "note"
)
SELECT
    "id", "orderId", "itemId", "name", NULL, "choiceIds", "addOnIds",
    "unitPrice", "quantity", "lineTotal", "note"
FROM "OrderItem";

DROP TABLE "OrderItem";
ALTER TABLE "new_OrderItem" RENAME TO "OrderItem";

CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

CREATE TABLE "OrderStatusEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrderStatusEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "OrderStatusEvent_orderId_at_idx" ON "OrderStatusEvent"("orderId", "at");

INSERT INTO "OrderStatusEvent" ("id", "orderId", "status", "at")
SELECT lower(hex(randomblob(16))), "id", "status", "createdAt" FROM "Order";

CREATE TABLE "MenuOverride" (
    "itemId" TEXT NOT NULL PRIMARY KEY,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "priceOverride" INTEGER,
    "updatedAt" DATETIME NOT NULL
);

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
