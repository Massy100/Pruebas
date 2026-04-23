import { ArrayVO } from "../Primitives/ArrayVO";

export class OrderItem {
    private readonly productId: string;
    private readonly quantity: number;
    private readonly unitPrice: number;

    private constructor(productId: string, quantity: number, unitPrice: number) {
        if (!productId || productId.trim().length === 0) {
            throw new Error('ProductId cannot be empty');
        }
        if (quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }
        if (unitPrice < 0) {
            throw new Error('UnitPrice cannot be negative');
        }
        
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public static create(productId: string, quantity: number, unitPrice: number): OrderItem {
        return new OrderItem(productId, quantity, unitPrice);
    }

    public getProductId(): string {
        return this.productId;
    }

    public getQuantity(): number {
        return this.quantity;
    }

    public getUnitPrice(): number {
        return this.unitPrice;
    }

    public getTotalPrice(): number {
        return this.quantity * this.unitPrice;
    }

    public equals(other: OrderItem): boolean {
        if (!other) return false;
        return this.productId === other.productId &&
               this.quantity === other.quantity &&
               this.unitPrice === other.unitPrice;
    }
}

export class OrderItems extends ArrayVO<OrderItem> {
    private constructor(items: OrderItem[]) {
        super(items);
    }

    public static create(items: OrderItem[] = []): OrderItems {
        return new OrderItems(items);
    }

    public addItem(item: OrderItem): OrderItems {
        return new OrderItems([...this.value, item]);
    }

    public removeItem(productId: string): OrderItems {
        return new OrderItems(this.value.filter(item => item.getProductId() !== productId));
    }

    public updateQuantity(productId: string, newQuantity: number): OrderItems {
        return new OrderItems(
            this.value.map(item => 
                item.getProductId() === productId 
                    ? OrderItem.create(productId, newQuantity, item.getUnitPrice())
                    : item
            )
        );
    }

    public getTotal(): number {
        return this.value.reduce((total, item) => total + item.getTotalPrice(), 0);
    }

    public getItemCount(): number {
        return this.value.reduce((count, item) => count + item.getQuantity(), 0);
    }

    public hasItem(productId: string): boolean {
        return this.value.some(item => item.getProductId() === productId);
    }

    public getItem(productId: string): OrderItem | undefined {
        return this.value.find(item => item.getProductId() === productId);
    }
}