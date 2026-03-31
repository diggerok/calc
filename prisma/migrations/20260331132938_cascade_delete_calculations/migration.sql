-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Calculation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "data" TEXT NOT NULL,
    "totalUsd" REAL NOT NULL,
    "totalRub" REAL NOT NULL,
    "markup" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Calculation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Calculation" ("createdAt", "data", "id", "markup", "name", "totalRub", "totalUsd", "type", "userId") SELECT "createdAt", "data", "id", "markup", "name", "totalRub", "totalUsd", "type", "userId" FROM "Calculation";
DROP TABLE "Calculation";
ALTER TABLE "new_Calculation" RENAME TO "Calculation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
