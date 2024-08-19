-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_productId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_UserId_fkey";

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
