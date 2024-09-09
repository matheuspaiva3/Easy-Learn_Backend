/*
  Warnings:

  - You are about to drop the `Buyer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BuyerToProducts" DROP CONSTRAINT "_BuyerToProducts_A_fkey";

-- DropTable
DROP TABLE "Buyer";

-- CreateTable
CREATE TABLE "buyers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buyers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "buyers_email_key" ON "buyers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "buyers_cpf_key" ON "buyers"("cpf");

-- AddForeignKey
ALTER TABLE "_BuyerToProducts" ADD CONSTRAINT "_BuyerToProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "buyers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
