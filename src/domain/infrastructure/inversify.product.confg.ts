import { Container } from 'inversify';
import { TYPES } from './types';
import { inMemoryOrderRepository } from '../../app/order/repositories/inMemoryOrderRepository';
import { inMemoryProductRepository } from '../../app/order/repositories/inMemoryProductRepository';
import { MockEventPublisher } from '../../app/mock/events/MockEventPublisher';
import { PlaceOrderUseCase } from '../../app/order/use-cases/PlaceOrderUseCase';

const productContainer = new Container();

productContainer.bind(TYPES.OrderRepository).to(inMemoryOrderRepository);
productContainer.bind(TYPES.ProductRepository).to(inMemoryProductRepository);

productContainer.bind(TYPES.EventPublisher).to(MockEventPublisher);

productContainer.bind(TYPES.PlaceOrderUseCase).to(PlaceOrderUseCase);

export { productContainer };