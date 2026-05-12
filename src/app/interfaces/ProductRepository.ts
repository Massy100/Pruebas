import type { Product } from "./Product";

export interface ProductRepository {
  save(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  update(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
  addProduct(product: Product): void;
  getProductsByIds(ids: string[]): Promise<Product[]>;
  clear(): void;
}