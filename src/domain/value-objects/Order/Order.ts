import { CustomerId } from "../Customer/CustomerId";
import { OrderItem } from "./OrderItem"; 
import { OrderStatus } from "./OrderStatus";

export class Order {
    private readonly id: string;
    private items: OrderItem[];
    private status: OrderStatus;
    private readonly customerId: CustomerId;

    private constructor(id: string, customerId: CustomerId) {
        this.id = id;
        this.customerId = customerId;
        this.items = [];
        this.status = OrderStatus.Draft;
    }

    public static create(customerId: CustomerId): Order {
        const id = Order.generateUniqueId();
        return new Order(id, customerId);
    }

    private static generateUniqueId(): string {
        return `ord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // public addItem(item: OrderItem): void {
    //     if (this.status !== OrderStatus.Draft) {
    //         throw new Error('Only draft orders can be modified');
    //     }
    //     this.items.push(item);
    // }

    // public submit(): void {
    //     if (this.items.length === 0) {
    //         throw new Error('Cannot submit empty order');
    //     }
    //     this.status = OrderStatus.Submitted;
    // }

    // getters
    public getId(): string { return this.id; }
    public getItems(): readonly OrderItem[] { return this.items; }
    public getStatus(): OrderStatus { return this.status; }
    public getCustomerId(): CustomerId { return this.customerId; }
}