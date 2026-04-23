import { EnumVO } from "../Primitives/EnumVO";

export class OrderStatus extends EnumVO<string> {
    private static readonly ALLOWED_VALUES = [
        'draft',
        'submitted', 
        'confirmed',
        'shipped',
        'delivered',
        'cancelled'
    ] as const;

    private constructor(value: string) {
        super(value, OrderStatus.ALLOWED_VALUES);
    }

    public static readonly Draft = new OrderStatus('draft');
    public static readonly Submitted = new OrderStatus('submitted');
    public static readonly Confirmed = new OrderStatus('confirmed');
    public static readonly Shipped = new OrderStatus('shipped');
    public static readonly Delivered = new OrderStatus('delivered');
    public static readonly Cancelled = new OrderStatus('cancelled');

    public static fromString(value: string): OrderStatus {
        switch (value) {
            case 'draft': return OrderStatus.Draft;
            case 'submitted': return OrderStatus.Submitted;
            case 'confirmed': return OrderStatus.Confirmed;
            case 'shipped': return OrderStatus.Shipped;
            case 'delivered': return OrderStatus.Delivered;
            case 'cancelled': return OrderStatus.Cancelled;
            default: throw new Error(`Invalid OrderStatus: ${value}`);
        }
    }

    public canTransitionTo(newStatus: OrderStatus): boolean {
        const transitions: Record<string, string[]> = {
            'draft': ['submitted', 'cancelled'],
            'submitted': ['confirmed', 'cancelled'],
            'confirmed': ['shipped', 'cancelled'],
            'shipped': ['delivered'],
            'delivered': [],
            'cancelled': []
        };
        
        return transitions[this.value]?.includes(newStatus.getValue()) || false;
    }
}