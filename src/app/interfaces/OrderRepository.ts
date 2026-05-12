import { OrderId } from "../../domain/value-objects/Order/OrderId";
import type { Order } from "./Order";

export interface OrderRepository {
    save(order: Order): Promise<void>;
    findById(orderId: OrderId): Promise<Order | null>;
    findAll(): Promise<Order[]>;
    delete(orderId: OrderId): Promise<void>;
    exists(orderId: OrderId): Promise<boolean>;
    update(order: Order): Promise<void>;
    clear(): void;
    getOrdersCount(): number;
}