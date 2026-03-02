/*
  Warnings:

  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DayRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskInstance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_userId_fkey";

-- DropForeignKey
ALTER TABLE "DayRecord" DROP CONSTRAINT "DayRecord_userId_fkey";

-- DropForeignKey
ALTER TABLE "TaskInstance" DROP CONSTRAINT "TaskInstance_templateId_fkey";

-- DropForeignKey
ALTER TABLE "TaskInstance" DROP CONSTRAINT "TaskInstance_userId_fkey";

-- DropForeignKey
ALTER TABLE "TaskTemplate" DROP CONSTRAINT "TaskTemplate_userId_fkey";

-- DropTable
DROP TABLE "Activity";

-- DropTable
DROP TABLE "DayRecord";

-- DropTable
DROP TABLE "TaskInstance";

-- DropTable
DROP TABLE "TaskTemplate";

-- CreateTable
CREATE TABLE "taskTemplate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "target" INTEGER,
    "unit" TEXT,
    "ifThenIf" TEXT,
    "ifThenThen" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "taskTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taskInstance" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "value" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "taskInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dayRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "tasksCompleted" INTEGER NOT NULL,
    "totalTasks" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dayRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "taskTemplate_userId_idx" ON "taskTemplate"("userId");

-- CreateIndex
CREATE INDEX "taskInstance_templateId_idx" ON "taskInstance"("templateId");

-- CreateIndex
CREATE INDEX "taskInstance_date_idx" ON "taskInstance"("date");

-- CreateIndex
CREATE UNIQUE INDEX "taskInstance_templateId_date_key" ON "taskInstance"("templateId", "date");

-- CreateIndex
CREATE INDEX "dayRecord_userId_idx" ON "dayRecord"("userId");

-- CreateIndex
CREATE INDEX "dayRecord_date_idx" ON "dayRecord"("date");

-- CreateIndex
CREATE UNIQUE INDEX "dayRecord_userId_date_key" ON "dayRecord"("userId", "date");

-- AddForeignKey
ALTER TABLE "taskTemplate" ADD CONSTRAINT "taskTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taskInstance" ADD CONSTRAINT "taskInstance_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "taskTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taskInstance" ADD CONSTRAINT "taskInstance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dayRecord" ADD CONSTRAINT "dayRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
