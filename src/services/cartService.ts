import { prisma } from '../libs/prisma';

export class CartService {
    async addToCart(id: number, productId: number, quantity: number) {
        console.log(id);
        try {
            // Verificar se o produto existe
            const product = await prisma.products.findUnique({
                where: { id: productId },
            });

            if (!product) {
                throw new Error('Produto não encontrado');
            }

            console.log('oi');

            // Buscar ou criar carrinho
            let cart = await prisma.cart.findFirst({
                where: { buyerId: id },
            });

            if (!cart) {
                cart = await prisma.cart.create({
                    data: { buyerId: id },
                });
            }

            // Verificar se o item já existe no carrinho
            const existingItem = await prisma.cartItem.findFirst({
                where: {
                    cartId: cart.id,
                    productId,
                },
            });

            if (existingItem) {
                // Atualizar quantidade
                return await prisma.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + quantity },
                    include: { product: true },
                });
            }

            // Criar novo item
            return await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
                include: { product: true },
            });
        } catch (error) {
            throw new Error(`Erro ao adicionar ao carrinho: ${error}`);
        }
    }

    async getCart(buyerId: number) {
        try {
            const cart = await prisma.cart.findFirst({
                where: { buyerId },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            if (!cart) {
                return null;
            }

            // Calcular total do carrinho
            const total = cart.items.reduce((acc, item) => {
                return acc + item.product.price * item.quantity;
            }, 0);

            return {
                ...cart,
                total,
            };
        } catch (error) {
            throw new Error(`Erro ao buscar carrinho: ${error}`);
        }
    }

    async removeFromCart(cartItemId: string) {
        try {
            return await prisma.cartItem.delete({
                where: { id: cartItemId },
            });
        } catch (error) {
            throw new Error(`Erro ao remover item do carrinho: ${error}`);
        }
    }

    async updateCartItemQuantity(cartItemId: string, quantity: number) {
        try {
            if (quantity <= 0) {
                return await this.removeFromCart(cartItemId);
            }

            return await prisma.cartItem.update({
                where: { id: cartItemId },
                data: { quantity },
                include: { product: true },
            });
        } catch (error) {
            throw new Error(`Erro ao atualizar quantidade: ${error}`);
        }
    }

    async clearCart(cartId: string) {
        try {
            await prisma.cartItem.deleteMany({
                where: { cartId },
            });
        } catch (error) {
            throw new Error(`Erro ao limpar carrinho: ${error}`);
        }
    }
}
