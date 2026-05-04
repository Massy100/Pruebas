import { OrderId } from "../../../domain/value-objects/Order/OrderId";
import { MockOrderRepository } from "../../mock/repositories/MockOrderRepository";
import { MockProductRepository } from "../../mock/repositories/MockProductRepository";
import { MockEventPublisher } from "../../mock/events/MockEventPublisher";

export interface PlaceOrderCommand {
    customerId: string;
    items: {
        productId: string;
        quantity: number;
    }[];
}

export interface OrderItem {
    getProductId(): string;
    getQuantity(): number;
    getUnitPrice(): number;
}

export class OrderItemImpl implements OrderItem {
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
}

export interface Order {
    getId(): OrderId;
    getCustomerId(): string;
    getItems(): OrderItem[];
    getTotal(): number;
    getStatus(): string;
}

export class OrderImpl implements Order {
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

export class PlaceOrderUseCase {
    private orderRepository: MockOrderRepository;
    private productRepository: MockProductRepository;
    private eventPublisher: MockEventPublisher;

    constructor(
        orderRepository: MockOrderRepository,
        productRepository: MockProductRepository,
        eventPublisher: MockEventPublisher
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.eventPublisher = eventPublisher;
    }

    async execute(command: PlaceOrderCommand): Promise<string> {
        if (!command.items || command.items.length === 0) {
            throw new Error('Order must have at least one item');
        }

        const orderItems: OrderItem[] = [];

        for (const item of command.items) {
            const product = await this.productRepository.findById(item.productId);
            
            if (!product) {
                throw new Error(`Product with id ${item.productId} not found`);
            }

            if (item.quantity <= 0) {
                throw new Error(`Quantity for product ${item.productId} must be greater than 0`);
            }

            orderItems.push(new OrderItemImpl(
                item.productId,
                item.quantity,
                product.price
            ));
        }

        const order = new OrderImpl(command.customerId, orderItems);
        
        await this.orderRepository.save(order);
        
        await this.eventPublisher.publish({
            eventName: 'OrderPlaced',
            occurredAt: new Date(),
            aggregateId: order.getId().toString(),
            data: {
                orderId: order.getId().toString(),
                customerId: order.getCustomerId(),
                total: order.getTotal(),
                items: order.getItems().map(item => ({
                    productId: item.getProductId(),
                    quantity: item.getQuantity(),
                    unitPrice: item.getUnitPrice()
                }))
            }
        });

        return order.getId().toString();
    }

    async getOrder(orderId: string): Promise<Order | null> {
        return this.orderRepository.findById(OrderId.from(orderId));
    }
}