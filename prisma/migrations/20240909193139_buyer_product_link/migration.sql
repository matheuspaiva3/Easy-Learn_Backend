-- CreateTable
CREATE TABLE "_BuyerToProducts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BuyerToProducts_AB_unique" ON "_BuyerToProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_BuyerToProducts_B_index" ON "_BuyerToProducts"("B");

-- AddForeignKey
ALTER TABLE "_BuyerToProducts" ADD CONSTRAINT "_BuyerToProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Buyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuyerToProducts" ADD CONSTRAINT "_BuyerToProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
