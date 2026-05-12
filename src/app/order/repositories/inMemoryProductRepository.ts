import type { Product } from "../../interfaces/Product";
import { injectable } from "inversify";
import type { ProductRepository } from "../../interfaces/ProductRepository";

@injectable()
export class inMemoryProductRepository implements ProductRepository{
    private products: Map<string, Product> = new Map();

    async findById(productId: string): Promise<Product | null> {
        return this.products.get(productId) || null;
    }

    async findAll(): Promise<Product[]> {
        return Array.from(this.products.values());
    }

    async save(product: Product): Promise<void> {
        this.products.set(product.id, product);
    }

    async update(product: Product): Promise<void> {
        if (this.products.has(product.id)) {
            this.products.set(product.id, product);
        } else {
            throw new Error(`Product with id ${product.id} not found`);
        }
    }

    async delete(productId: string): Promise<void> {
        this.products.delete(productId);
    }

    addProduct(product: Product): void {
        this.products.set(product.id, product);
    }

    async getProductsByIds(ids: string[]): Promise<Product[]> {
        const products: Product[] = [];
        for (const id of ids) {
            const product = this.products.get(id);
            if (product) {
                products.push(product);
            }
        }
        return products;
    }

    clear(): void {
        this.products.clear();
    }
}