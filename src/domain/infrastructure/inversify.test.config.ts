import { Container } from 'inversify';
import { TYPES } from './types';
import { MockOrderRepository } from '../../app/mock/repositories/MockOrderRepository';
import { MockProductRepository } from '../../app/mock/repositories/MockProductRepository';
import { MockEventPublisher } from '../../app/mock/events/MockEventPublisher';
import { PlaceOrderUseCase } from '../../app/order/use-cases/PlaceOrderUseCase';

const testContainer = new Container();

testContainer.bind(TYPES.OrderRepository).to(MockOrderRepository);
testContainer.bind(TYPES.ProductRepository).to(MockProductRepository);

testContainer.bind(TYPES.EventPublisher).to(MockEventPublisher);

testContainer.bind(TYPES.PlaceOrderUseCase).to(PlaceOrderUseCase);

export { testContainer };