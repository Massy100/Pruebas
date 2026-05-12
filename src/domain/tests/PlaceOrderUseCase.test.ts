import { describe, expect, it, beforeEach } from "vitest";
import { PlaceOrderUseCase } from "../../app/order/use-cases/PlaceOrderUseCase";
import type { PlaceOrderCommand } from "../../app/interfaces/PlaceOrderCommand";

import { OrderId } from "../value-objects/Order/OrderId";


import type { OrderRepository } from "../../app/interfaces/OrderRepository";
import type { ProductRepository } from "../../app/interfaces/ProductRepository";
import { testContainer } from "../infrastructure/inversify.test.config";
import { TYPES } from "../infrastructure/types";
import type { MockEventPublisher } from "../../app/mock/events/MockEventPublisher";

class TestEventPublisher {
    public publishedEvents: any[] = [];

    async publish(event: any): Promise<void> {
        this.publishedEvents.push(event);
    }

    clear(): void {
        this.publishedEvents = [];
    }
}

describe('PlaceOrderUseCase', () => {
    let handler: PlaceOrderUseCase;
    let orderRepo: OrderRepository;
    let productRepo: ProductRepository;
    let eventPublisher: MockEventPublisher;

    beforeEach(() => {
        orderRepo = testContainer.get(TYPES.OrderRepository);
        productRepo = testContainer.get(TYPES.ProductRepository);
        eventPublisher = testContainer.get(TYPES.EventPublisher);
        handler = testContainer.get(TYPES.PlaceOrderUseCase);
    });

    it('creates order with items and saves', async () => {
        await productRepo.save({ id: 'prod-1', price: 10.00, name: 'Product 1', stock: 10 });
        await productRepo.save({ id: 'prod-2', price: 20.00, name: 'Product 2', stock: 5 });
        
        const command: PlaceOrderCommand = {
            customerId: 'cust-123',
            items: [
                { productId: 'prod-1', quantity: 2 },
                { productId: 'prod-2', quantity: 1 }
            ],
        };
        
        const orderId = await handler.execute(command);
        expect(orderId).toBeDefined();
        
        const savedOrder = await orderRepo.findById(OrderId.from(orderId));
        expect(savedOrder).toBeDefined();
        expect(savedOrder?.getItems()).toHaveLength(2);
        expect(savedOrder?.getItems()[0].getProductId()).toBe('prod-1');
        expect(savedOrder?.getItems()[0].getQuantity()).toBe(2);
        expect(savedOrder?.getItems()[0].getUnitPrice()).toBe(10.00);
        expect(savedOrder?.getItems()[1].getProductId()).toBe('prod-2');
        expect(savedOrder?.getItems()[1].getQuantity()).toBe(1);
        expect(savedOrder?.getItems()[1].getUnitPrice()).toBe(20.00);
    });

    it('should throw error when product not found', async () => {
        const command: PlaceOrderCommand = {
            customerId: 'cust-123',
            items: [
                { productId: 'non-existent', quantity: 1 }
            ],
        };
        
        await expect(handler.execute(command)).rejects.toThrow('Product with id non-existent not found');
    });

    it('should throw error when order has no items', async () => {
        const command: PlaceOrderCommand = {
            customerId: 'cust-123',
            items: [],
        };
        
        await expect(handler.execute(command)).rejects.toThrow('Order must have at least one item');
    });

    it('should throw error when quantity is zero or negative', async () => {
        await productRepo.save({ id: 'prod-1', price: 10.00, stock: 10 });
        
        const command: PlaceOrderCommand = {
            customerId: 'cust-123',
            items: [
                { productId: 'prod-1', quantity: 0 }
            ],
        };
        
        await expect(handler.execute(command)).rejects.toThrow('Quantity for product prod-1 must be greater than 0');
    });

    it('should throw error when insufficient stock', async () => {
        await productRepo.save({ id: 'prod-1', price: 10.00, stock: 1 });
        
        const command: PlaceOrderCommand = {
            customerId: 'cust-123',
            items: [
                { productId: 'prod-1', quantity: 5 }
            ],
        };
        
        await expect(handler.execute(command)).rejects.toThrow('Insufficient stock for product prod-1');
    });

    it('should publish event when order is created', async () => {
        //FIX
        eventPublisher.clearEvents();
        await productRepo.save({ id: 'prod-1', price: 10.00, stock: 10 });
        
        const command: PlaceOrderCommand = {
            customerId: 'cust-123',
            items: [
                { productId: 'prod-1', quantity: 2 }
            ],
        };
        
        const orderId = await handler.execute(command);
        
        expect(eventPublisher.publishedEvents).toHaveLength(1);
        const publishedEvent = eventPublisher.publishedEvents[0];
        expect(publishedEvent.eventName).toBe('OrderPlaced');
        expect(publishedEvent.data.orderId).toBe(orderId);
        expect(publishedEvent.data.customerId).toBe('cust-123');
        expect(publishedEvent.data.total).toBe(20.00);
        expect(publishedEvent.data.items).toHaveLength(1);
        expect(publishedEvent.data.items[0]).toEqual({
            productId: 'prod-1',
            quantity: 2,
            unitPrice: 10.00
        });
    });

    it('should retrieve an existing order by id', async () => {
        await productRepo.save({ id: 'prod-1', price: 10.00, stock: 10 });
        
        const command: PlaceOrderCommand = {
            customerId: 'cust-123',
            items: [
                { productId: 'prod-1', quantity: 2 }
            ],
        };
        
        const orderId = await handler.execute(command);
        
        const retrievedOrder = await handler.getOrder(orderId);
        expect(retrievedOrder).toBeDefined();
        expect(retrievedOrder?.getId().toString()).toBe(orderId);
        expect(retrievedOrder?.getCustomerId()).toBe('cust-123');
        expect(retrievedOrder?.getTotal()).toBe(20.00);
    });

    it('should return null when order not found', async () => {
        const retrievedOrder = await handler.getOrder('non-existent-id');
        expect(retrievedOrder).toBeNull();
    });

    it('should update product stock after order creation', async () => {
        const product = { id: 'prod-1', price: 10.00, stock: 10 };
        await productRepo.save(product);
        
        const command: PlaceOrderCommand = {
            customerId: 'cust-123',
            items: [
                { productId: 'prod-1', quantity: 3 }
            ],
        };
        
        await handler.execute(command);
        await handler.updateProductStock('prod-1', 3);
        
        const updatedProduct = await productRepo.findById('prod-1');
        expect(updatedProduct?.stock).toBe(7);
    });

    it('should handle multiple orders correctly', async () => {
        //FIX
        orderRepo.clear();

        await productRepo.save({ id: 'prod-1', price: 10.00, stock: 20 });
        
        const command1: PlaceOrderCommand = {
            customerId: 'cust-1',
            items: [{ productId: 'prod-1', quantity: 2 }],
        };
        
        const command2: PlaceOrderCommand = {
            customerId: 'cust-2',
            items: [{ productId: 'prod-1', quantity: 3 }],
        };
        
        const orderId1 = await handler.execute(command1);
        const orderId2 = await handler.execute(command2);
        
        const allOrders = await orderRepo.findAll();
        expect(allOrders).toHaveLength(2);
        
        const order1 = await orderRepo.findById(OrderId.from(orderId1));
        const order2 = await orderRepo.findById(OrderId.from(orderId2));
        
        expect(order1?.getCustomerId()).toBe('cust-1');
        expect(order2?.getCustomerId()).toBe('cust-2');
        expect(order1?.getTotal()).toBe(20.00);
        expect(order2?.getTotal()).toBe(30.00);
    });
});