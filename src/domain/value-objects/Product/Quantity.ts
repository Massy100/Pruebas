export class Quantity {
    private readonly value: number;

    private constructor(value: number) {
        if (!this.isValid(value)) {
            throw new Error('Invalid quantity. Must be greater than 0');
        }
        this.value = value;
    }

    public static create(value: number): Quantity {
        return new Quantity(value);
    }

    private isValid(value: number): boolean {
        return Number.isInteger(value) && value > 0;
    }

    public getValue(): number {
        return this.value;
    }

    public add(other: Quantity): Quantity {
        return new Quantity(this.value + other.getValue());
    }

    public subtract(other: Quantity): Quantity {
        const result = this.value - other.getValue();
        if (result < 0) {
            throw new Error('Quantity cannot be negative');
        }
        return new Quantity(result);
    }

    public equals(other: Quantity): boolean {
        if (!other) return false;
        return this.value === other.getValue();
    }

    public toString(): string {
        return this.value.toString();
    }
}