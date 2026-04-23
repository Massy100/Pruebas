export class CustomerId {
    private readonly value: string;

    private constructor(value: string) {
        if (!this.isValid(value)) {
            throw new Error('Invalid CustomerId format. Expected format: cust-{number} (e.g., cust-123)');
        }
        this.value = value;
    }

    public static create(value: string): CustomerId {
        return new CustomerId(value);
    }

    public static generate(): CustomerId {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return new CustomerId(`cust-${timestamp}${random}`);
    }

    private isValid(value: string): boolean {
        const pattern = /^cust-\d+$/;
        return pattern.test(value);
    }

    public getValue(): string {
        return this.value;
    }

    public getNumber(): number {
        const match = this.value.match(/^cust-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
    }

    public equals(other: CustomerId): boolean {
        if (!other) return false;
        return this.value === other.getValue();
    }

    public toString(): string {
        return this.value;
    }
}