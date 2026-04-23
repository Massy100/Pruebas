export abstract class EnumVO<T> {
    protected readonly value: T;

    protected constructor(value: T, allowedValues: readonly T[]) {
        if (!allowedValues.includes(value)) {
            throw new Error(`Invalid value: ${value}. Allowed values: ${allowedValues.join(', ')}`);
        }
        this.value = value;
    }

    public getValue(): T {
        return this.value;
    }

    public equals(other: EnumVO<T>): boolean {
        if (!other) return false;
        return this.value === other.getValue();
    }

    public toString(): string {
        return String(this.value);
    }
}