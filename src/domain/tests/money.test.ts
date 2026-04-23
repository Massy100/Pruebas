import { describe, it, expect } from 'vitest';
import { Money } from "../value-objects/Money/Money";
import { InvalidMoneyError, CurrencyMismatchError } from "../shared/Errors";

describe('Money', () => {
    describe('create', () => {
        it('created money with valid amount', () => {
            const money = Money.create('1', 10.0, 'USD');

            expect(money.getAmount()).toBe(10.0);
            expect(money.getCurrency()).toBe('USD');
        });

        it('throws error when creating money with negative amount', () => {
            expect(() => Money.create('1', -10.0, 'USD')).toThrow(InvalidMoneyError);
        });
    });

    describe('add', () => {
        it('adds two money with same currency', () => {
            const a = Money.create('1', 10.0, 'USD');
            const b = Money.create('2', 20.0, 'USD');
            const result = a.add(b);

            expect(result.getAmount()).toBe(30.0);
            expect(result.getCurrency()).toBe('USD');
        });

        it('throws error when adding money with different currencies', () => {
            const usd = Money.create('1', 10.0, 'USD');
            const eur = Money.create('2', 10.0, 'EUR');

            expect(() => usd.add(eur)).toThrow(CurrencyMismatchError);
        });
    });

    describe('equality', () => {
        it('equals money with same amount and currency', () => {
            const a = Money.create('1', 10.0, 'USD');
            const b = Money.create('2', 10.0, 'USD');

            expect(a.equals(b)).toBe(true);
        });

        it('does not equal money with different amount', () => {
            const a = Money.create('1', 10.0, 'USD');
            const b = Money.create('2', 20.0, 'USD');

            expect(a.equals(b)).toBe(false);
        });
        
        it('does not equal money with different currency', () => {
            const a = Money.create('1', 10.0, 'USD');
            const b = Money.create('2', 10.0, 'EUR');

            expect(a.equals(b)).toBe(false);
        });
    });
});