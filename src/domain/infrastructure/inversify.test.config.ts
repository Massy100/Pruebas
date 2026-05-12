import { Container } from 'inversify';
import { TYPES } from './types';
import { MockOrderRepository } from '../../app/mock/repositories/MockOrderRepository';
import { MockProductRepository } from '../../app/mock/repositories/MockProductRepository';
import { MockEventPublisher } from '../../app/mock/events/MockEventPublisher';
import { PlaceOrderUseCase } from '../../app/order/use-cases/PlaceOrderUseCase';

const testContainer = new Container();

testContainer.bind(TYPES.OrderRepository).to(MockOrderRepository).inSingletonScope();
testContainer.bind(TYPES.ProductRepository).to(MockProductRepository).inSingletonScope();
testContainer.bind(TYPES.EventPublisher).to(MockEventPublisher).inSingletonScope();
testContainer.bind(TYPES.PlaceOrderUseCase).to(PlaceOrderUseCase).inSingletonScope();

export { testContainer };