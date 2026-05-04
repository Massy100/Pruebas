export class OrderId {
    private value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static from(value: string): OrderId {
        if (!value || value.trim() === '') {
            throw new Error('OrderId cannot be empty');
        }
        return new OrderId(value);
    }

    static generate(): OrderId {
        return new OrderId(crypto.randomUUID());
    }

    toString(): string {
        return this.value;
    }

    equals(other: OrderId): boolean {
        return this.value === other.value;
    }
}