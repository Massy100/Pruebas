export class InvalidMoneyError extends Error {
    constructor(message: string) {
        super(`InvalidMoneyError: ${message}`);
        this.name = 'InvalidMoneyError';
    }
}

export class CurrencyMismatchError extends Error {
    constructor(message: string) {
        super(`CurrencyMismatchError: ${message}`);
        this.name = 'CurrencyMismatchError';
    }
}