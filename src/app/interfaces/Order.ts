import { OrderId } from "../../domain/value-objects/Order/OrderId";
import type { OrderItem } from "./OrderItem"; 

export interface Order {
    getId(): OrderId;
    getCustomerId(): string;
    getItems(): OrderItem[];
    getTotal(): number;
    getStatus(): string;
}