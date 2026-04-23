export abstract class ArrayVO<T> {
    protected readonly value: readonly T[];

    protected constructor(value: T[]) {
        if (!Array.isArray(value)) {
            throw new Error('Value must be an array');
        }
        this.value = [...value]; 
    }

    public getValue(): readonly T[] {
        return this.value;
    }

    public get length(): number {
        return this.value.length;
    }

    public isEmpty(): boolean {
        return this.value.length === 0;
    }

    public contains(item: T): boolean {
        return this.value.includes(item);
    }

    public equals(other: ArrayVO<T>): boolean {
        if (!other) return false;
        if (this.value.length !== other.value.length) return false;
        
        return this.value.every((item, index) => item === other.value[index]);
    }

    public toString(): string {
        return `[${this.value.join(', ')}]`;
    }
}