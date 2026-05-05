import { OrderId } from "../../../domain/value-objects/Order/OrderId";
import type { OrderItem } from "../../interfaces/OrderItem";
import type { Order } from "../../interfaces/Order";

export class OrderUseCase implements Order {
    private id: OrderId;
    private status: string = 'PENDING';
    private customerId: string;
    private items: OrderItem[];

    constructor(customerId: string, items: OrderItem[], id?: OrderId) {
        this.customerId = customerId;
        this.items = items;
        this.id = id || OrderId.generate();
    }

    getId(): OrderId {
        return this.id;
    }

    getCustomerId(): string {
        return this.customerId;
    }

    getItems(): OrderItem[] {
        return [...this.items];
    }

    getTotal(): number {
        return this.items.reduce((total, item) => {
            return total + (item.getUnitPrice() * item.getQuantity());
        }, 0);
    }

    getStatus(): string {
        return this.status;
    }

    confirm(): void {
        this.status = 'CONFIRMED';
    }

    cancel(): void {
        this.status = 'CANCELLED';
    }
}