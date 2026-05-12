import { OrderId } from "../../../domain/value-objects/Order/OrderId";
import type { OrderRepository } from "../../interfaces/OrderRepository";
import type { OrderItem } from "../../interfaces/OrderItem";
import type { Order } from "../../interfaces/Order";
import type { PlaceOrderCommand } from "../../interfaces/PlaceOrderCommand";
import { OrderUseCase } from "./OrderUseCase";
import { OrderItemUseCase } from "./OrderItemUseCase";
import type { OrderPlacedEvent } from "../event/OrderPlacedEvent";

import { TYPES } from "../../../domain/infrastructure/types";
import { inject, injectable } from "inversify";
import type { ProductRepository } from "../../interfaces/ProductRepository";

@injectable()
export class PlaceOrderUseCase {
    
    constructor(
        @inject(TYPES.OrderRepository)  private  orderRepository: OrderRepository,
        @inject(TYPES.ProductRepository) private productRepository: ProductRepository,
        @inject(TYPES.EventPublisher) 
        private eventPublisher: {
            publish(event: OrderPlacedEvent): Promise<void>;
        }
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.eventPublisher = eventPublisher;
    }

    async execute(command: PlaceOrderCommand): Promise<string> {
        if (!command.items || command.items.length === 0) {
            throw new Error('Order must have at least one item');
        }

        const orderItems: OrderItem[] = [];

        for (const item of command.items) {
            const product = await this.productRepository.findById(item.productId);
            
            if (!product) {
                throw new Error(`Product with id ${item.productId} not found`);
            }

            if (item.quantity <= 0) {
                throw new Error(`Quantity for product ${item.productId} must be greater than 0`);
            }

            if (product.stock !== undefined && item.quantity > product.stock) {
                throw new Error(`Insufficient stock for product ${item.productId}. Available: ${product.stock}, Requested: ${item.quantity}`);
            }

            const orderItem = new OrderItemUseCase(
                item.productId,
                item.quantity,
                product.price
            );
            orderItems.push(orderItem);
        }

        const order = new OrderUseCase(command.customerId, orderItems);
        
        await this.orderRepository.save(order);
        
        const orderPlacedEvent: OrderPlacedEvent = {
            eventName: 'OrderPlaced',
            occurredAt: new Date(),
            aggregateId: order.getId().toString(),
            data: {
                orderId: order.getId().toString(),
                customerId: order.getCustomerId(),
                total: order.getTotal(),
                items: order.getItems().map(item => ({
                    productId: item.getProductId(),
                    quantity: item.getQuantity(),
                    unitPrice: item.getUnitPrice()
                }))
            }
        };
        
        await this.eventPublisher.publish(orderPlacedEvent);

        return order.getId().toString();
    }

    async getOrder(orderId: string): Promise<Order | null> {
        try {
            const order = await this.orderRepository.findById(OrderId.from(orderId));
            return order;
        } catch (error) {
            return null;
        }
    }

    async updateProductStock(productId: string, quantity: number): Promise<void> {
        const product = await this.productRepository.findById(productId);
        if (product && product.stock !== undefined) {
            product.stock -= quantity;
            await this.productRepository.update(product);
        }
    }
}