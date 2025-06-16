-- CreateTable
CREATE TABLE "Scan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "repository" TEXT NOT NULL,
    "commitSha" TEXT NOT NULL,
    "commitMessage" TEXT NOT NULL,
    "commitDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "package" TEXT NOT NULL,
    "isSuccess" BOOLEAN NOT NULL,
    "numTrace" INTEGER NOT NULL,
    "numType" INTEGER NOT NULL,
    "numHotSpot" INTEGER NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "durationMsHotSpot" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "error" TEXT,
    "scanId" INTEGER NOT NULL,
    CONSTRAINT "Result_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Result_scanId_package_key" ON "Result"("scanId", "package");
