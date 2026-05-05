import { OrderId } from "../../../domain/value-objects/Order/OrderId";
import type { Order } from "../../interfaces/Order";

export class inMemoryOrderRepository {
    private orders: Map<string, Order> = new Map();

    async save(order: Order): Promise<void> {
        const orderId = order.getId().toString();
        this.orders.set(orderId, order);
    }

    async findById(orderId: OrderId): Promise<Order | null> {
        const order = this.orders.get(orderId.toString());
        return order || null;
    }

    async findAll(): Promise<Order[]> {
        return Array.from(this.orders.values());
    }

    async delete(orderId: OrderId): Promise<void> {
        this.orders.delete(orderId.toString());
    }

    async exists(orderId: OrderId): Promise<boolean> {
        return this.orders.has(orderId.toString());
    }

    async update(order: Order): Promise<void> {
        const orderId = order.getId().toString();
        if (this.orders.has(orderId)) {
            this.orders.set(orderId, order);
        } else {
            throw new Error(`Order with id ${orderId} not found`);
        }
    }

    clear(): void {
        this.orders.clear();
    }

    getOrdersCount(): number {
        return this.orders.size;
    }
}