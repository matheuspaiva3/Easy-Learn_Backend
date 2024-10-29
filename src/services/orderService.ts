import { prisma } from '../libs/prisma';
import { CartService } from './cartService';
export class OrderService {
    async createOrder(buyerId: number) {
      try {
        // Buscar carrinho do comprador
        const cartService = new CartService();
        const cart = await cartService.getCart(buyerId);
        
        if (!cart || cart.items.length === 0) {
          return ('Carrinho vazio');
        }
        console.log(cart)
        // Criar pedido
        const order = await prisma.order.create({
          data: {
            buyerId,
            total: cart.total,
            status: 'PAID',
            items: {
              create: cart.items.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.price
              }))
            }
          },
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        });
  
        // Adicionar produtos ao buyer
        await prisma.buyer.update({
          where: { id: buyerId },
          data: {
            products: {
              connect: cart.items.map(item => ({
                id: item.product.id
              }))
            }
          }
        });
  
        // Limpar carrinho
        await cartService.clearCart(cart.id);
  
        return order;
      } catch (error) {
        throw new Error(`Erro ao criar pedido`);
      }
    }
  
    async getOrders(buyerId: number) {
      try {
        return await prisma.order.findMany({
          where: { buyerId },
          include: {
            items: {
              include: {
                product: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
      } catch (error) {
        throw new Error(`Erro ao buscar pedidos`);
      }
    }
  
    async updateOrderStatus(orderId: string, status: 'PENDING' | 'PAID' | 'CANCELLED') {
      try {
        return await prisma.order.update({
          where: { id: orderId },
          data: { status }
        });
      } catch (error) {
        throw new Error(`Erro ao atualizar status do pedido`);
      }
    }
  }