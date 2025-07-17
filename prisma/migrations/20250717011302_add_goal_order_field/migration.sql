-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_goals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "goalType" TEXT NOT NULL DEFAULT 'daily',
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'in-progress',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_goals" ("createdAt", "description", "goalType", "id", "isCompleted", "status", "title", "updatedAt") SELECT "createdAt", "description", "goalType", "id", "isCompleted", "status", "title", "updatedAt" FROM "goals";
DROP TABLE "goals";
ALTER TABLE "new_goals" RENAME TO "goals";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
