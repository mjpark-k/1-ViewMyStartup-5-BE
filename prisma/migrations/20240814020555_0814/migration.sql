-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_startupId_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
