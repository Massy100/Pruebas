export interface OrderPlacedEvent {
    eventName: string;
    occurredAt: Date;
    aggregateId: string;
    data: {
        orderId: string;
        customerId: string;
        total: number;
        items: Array<{
            productId: string;
            quantity: number;
            unitPrice: number;
        }>;
    };
}