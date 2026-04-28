import { CustomerId } from "../Customer/CustomerId";
import { OrderItem } from "./OrderItem"; 
import { OrderStatus } from "./OrderStatus";
import { ProductId } from "../Product/ProductId";
import { Quantity } from "../Product/Quantity";
import { Money } from "../Money/Money";

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

    public addItem(productId: string, quantity: number, unitPrice: number): void {
        if (this.status !== OrderStatus.Draft) {
            throw new Error('Only draft orders can be modified');
        }
        
        const existingItem = this.items.find(item => 
            item.getProductId() === productId
        );
        
        if (existingItem) {
            const newQuantity = existingItem.getQuantity() + quantity;
            const updatedItem = OrderItem.create(productId, newQuantity, unitPrice);
            const index = this.items.findIndex(item => item.getProductId() === productId);
            this.items[index] = updatedItem;
        } else {
            const orderItem = OrderItem.create(productId, quantity, unitPrice);
            this.items.push(orderItem);
        }
    }

    public cancel(reason: string): void {
        if (this.status === OrderStatus.Cancelled) {
            throw new Error('Order is already cancelled');
        }
        this.status = OrderStatus.Cancelled;
    }

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

// OrderMother Factory
export class OrderMother {
    static create(customerId?: CustomerId): Order {
        const id = customerId || CustomerId.generate();
        return Order.create(id);
    }

    static draft(customerId?: CustomerId): Order {
        const id = customerId || CustomerId.generate();
        return Order.create(id);
    }

    static withItems(n: number = 1): Order {
        const order = Order.create(CustomerId.generate());
        
        for (let i = 0; i < n; i++) {
            const productId = ProductId.from(`prod-${i + 1}`).getValue(); 
            const quantity = Quantity.create(1).getValue();                 
            const unitPrice = Money.create(`item-${i + 1}`, 10.00 * (i + 1), 'USD').getAmount(); 
            order.addItem(productId, quantity, unitPrice);
        }
        
        return order;
    }
}