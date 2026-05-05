import type { OrderItem } from "../../interfaces/OrderItem";

export class OrderItemUseCase implements OrderItem {
    private productId: string;
    private quantity: number;
    private unitPrice: number;

    constructor(productId: string, quantity: number, unitPrice: number) {
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    getProductId(): string {
        return this.productId;
    }

    getQuantity(): number {
        return this.quantity;
    }

    getUnitPrice(): number {
        return this.unitPrice;
    }

    getTotalPrice(): number {
        return this.quantity * this.unitPrice;
    }

    equals(other: OrderItem): boolean {
        return other.getProductId() === this.productId;
    }
}