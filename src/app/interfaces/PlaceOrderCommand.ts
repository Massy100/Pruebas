export interface PlaceOrderCommand {
    customerId: string;
    items: {
        productId: string;
        quantity: number;
    }[];
}