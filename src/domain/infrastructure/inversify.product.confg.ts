import { Container } from 'inversify';
import { TYPES } from './types';
import { inMemoryOrderRepository } from '../../app/order/repositories/inMemoryOrderRepository';
import { inMemoryProductRepository } from '../../app/order/repositories/inMemoryProductRepository';
import { MockEventPublisher } from '../../app/mock/events/MockEventPublisher';
import { PlaceOrderUseCase } from '../../app/order/use-cases/PlaceOrderUseCase';

const productContainer = new Container();

productContainer.bind(TYPES.OrderRepository).to(inMemoryOrderRepository).inSingletonScope();
productContainer.bind(TYPES.ProductRepository).to(inMemoryProductRepository).inSingletonScope();
productContainer.bind(TYPES.EventPublisher).to(MockEventPublisher).inSingletonScope();
productContainer.bind(TYPES.PlaceOrderUseCase).to(PlaceOrderUseCase).inSingletonScope();

export { productContainer };