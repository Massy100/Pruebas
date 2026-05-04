import { describe, expect, it, beforeEach } from "vitest";
import { PlaceOrderUseCase } from "../../app/order/use-cases/PlaceOrderUseCase";
import type { PlaceOrderCommand } from "../../app/order/use-cases/PlaceOrderUseCase";
import { MockOrderRepository } from "../../app/mock/repositories/MockOrderRepository";
import { MockProductRepository } from "../../app/mock/repositories/MockProductRepository";
import { MockEventPublisher } from "../../app/mock/events/MockEventPublisher";
import { OrderId } from "../value-objects/Order/OrderId";

describe('PlaceOrderUseCase', () => {
    let handler: PlaceOrderUseCase;
    let orderRepo: MockOrderRepository;
    let productRepo: MockProductRepository;
    let eventPublisher: MockEventPublisher;

    beforeEach(() => {
        orderRepo = new MockOrderRepository();
        productRepo = new MockProductRepository();
        eventPublisher = new MockEventPublisher();
        handler = new PlaceOrderUseCase(orderRepo, productRepo, eventPublisher);
    });

    it('creates order with items and saves', async () => {
        productRepo.addProduct({ id: 'prod-1', price: 10.00 });
        productRepo.addProduct({ id: 'prod-2', price: 20.00 });
        
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
});