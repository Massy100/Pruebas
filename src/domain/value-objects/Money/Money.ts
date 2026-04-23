// para correr las pruebas npm run test
import { InvalidMoneyError } from "../../shared/Errors";
import { CurrencyMismatchError } from "../../shared/Errors";

export class Money {
    private readonly id: string;
    private readonly amount: number;
    private readonly currency: string;

    private constructor(id: string, amount: number, currency: string) {
        this.id = id;
        this.amount = amount;
        this.currency = currency;
    }

    public static create(id: string, amount: number, currency: string): Money {
        if (amount < 0) {
            throw new InvalidMoneyError("Amount cannot be negative");
        }
        if (!currency || currency.trim().length === 0) {
            throw new InvalidMoneyError("Currency cannot be empty");
        }
        return new Money(id, amount, currency);
    }

    public getId(): string {
        return this.id;
    }

    public getAmount(): number {
        return this.amount;
    }

    public getCurrency(): string {
        return this.currency;
    }

    public add(other: Money): Money {
        if (this.currency !== other.currency) {
            throw new CurrencyMismatchError("Cannot add money with different currencies");
        }
        return Money.create(this.id, this.amount + other.amount, this.currency);
    }

    public equals(other: Money): boolean {
        return this.amount === other.amount && this.currency === other.currency;
    }

    public toString(): string {
        return `${this.amount} ${this.currency}`;
    }
}