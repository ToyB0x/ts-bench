-- CreateTable
CREATE TABLE "Scan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "repository" TEXT NOT NULL,
    "commitSha" TEXT NOT NULL,
    "commitMessage" TEXT NOT NULL,
    "commitDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "packageName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "numTrace" INTEGER NOT NULL,
    "numType" INTEGER NOT NULL,
    "numHotSpot" INTEGER NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "durationMsHotSpot" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "scanId" TEXT NOT NULL,
    CONSTRAINT "Result_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Result_scanId_packageName_key" ON "Result"("scanId", "packageName");
