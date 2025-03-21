/*
  Warnings:

  - You are about to drop the column `compound_id` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `provider_id` on the `accounts` table. All the data in the column will be lost.
  - Added the required column `provider` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_accounts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "provider_type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "access_token_expires" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_accounts" ("access_token", "access_token_expires", "created_at", "id", "provider_account_id", "provider_type", "refresh_token", "updated_at", "userId", "user_id") SELECT "access_token", "access_token_expires", "created_at", "id", "provider_account_id", "provider_type", "refresh_token", "updated_at", "userId", "user_id" FROM "accounts";
DROP TABLE "accounts";
ALTER TABLE "new_accounts" RENAME TO "accounts";
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
