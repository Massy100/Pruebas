import { ProductId } from "./ProductId";
import { Quantity } from "./Quantity";
import { Money } from "../Money/Money";

export class Product {
    private readonly id: ProductId;
    private quantity: Quantity;
    private price: Money;

    private constructor(id: ProductId, quantity: Quantity, price: Money) {
        this.id = id;
        this.quantity = quantity;
        this.price = price;
    }

    public static create(id: ProductId, quantity: Quantity, price: Money): Product {
        return new Product(id, quantity, price);
    }

    public static from(id: string, quantity: number, priceId: string, priceAmount: number, priceCurrency: string): Product {
        const productId = ProductId.from(id);
        const productQuantity = Quantity.create(quantity);
        const productPrice = Money.create(priceId, priceAmount, priceCurrency);
        return new Product(productId, productQuantity, productPrice);
    }

    public updateQuantity(quantity: Quantity): void {
        this.quantity = quantity;
    }

    public addQuantity(additionalQuantity: Quantity): void {
        this.quantity = this.quantity.add(additionalQuantity);
    }

    public getId(): ProductId {
        return this.id;
    }

    public getQuantity(): Quantity {
        return this.quantity;
    }

    public getPrice(): Money {
        return this.price;
    }

    public equals(other: Product): boolean {
        if (!other) return false;
        return this.id.equals(other.getId());
    }
}