export interface OrderItem {
    getProductId(): string;
    getQuantity(): number;
    getUnitPrice(): number;
    getTotalPrice(): number;  
    equals(other: OrderItem): boolean; 
}