export class ProductId {
    private readonly value: string;

    private constructor(value: string) {
        if (!this.isValid(value)) {
            throw new Error('Invalid ProductId format. Expected format: prod-{number} (e.g., prod-123)');
        }
        this.value = value;
    }

    public static create(value: string): ProductId {
        return new ProductId(value);
    }

    public static from(value: string): ProductId {
        return new ProductId(value);
    }

    public static generate(): ProductId {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return new ProductId(`prod-${timestamp}${random}`);
    }

    private isValid(value: string): boolean {
        const pattern = /^prod-\d+$/;
        return pattern.test(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: ProductId): boolean {
        if (!other) return false;
        return this.value === other.getValue();
    }

    public toString(): string {
        return this.value;
    }
}