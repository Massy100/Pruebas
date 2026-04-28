import { describe, expect, it } from "vitest";
import { Order } from "../value-objects/Order/Order";
import { CustomerId } from "../value-objects/Customer/CustomerId";
import { OrderStatus } from "../value-objects/Order/OrderStatus";
import { Money } from "../value-objects/Money/Money";
import { Quantity } from "../value-objects/Product/Quantity";
import { ProductId } from "../value-objects/Product/ProductId";

// import { InvalidMoneyError } from "../shared/Errors";
// import { OrderCreated, OrderConfirmed } from "./Events";
// import { InvalidOrderStateError, EmptyOrderError, InvalidQuantityError } from "./Errors";

describe('Order', ()=>{
    describe('create', () =>{
        it('creates order with draft status', () => {
            const customerId = CustomerId.create('cust-123');
            const order = Order.create(customerId);

            expect(order.getStatus()).toBe(OrderStatus.Draft);
            expect(order.getCustomerId()).toEqual(customerId);
            expect(order.getItems()).toHaveLength(0);
            expect(order).toBeDefined();
        });

        // it('emits OrderCreated event', () => {
        //     const customerId = CustomerId.create('cust-123');
        //     const order = Order.create(customerId);
        //
        //     expect(order.domainEvents()).toHaveLength(1);
        //     expect(order.domainEvents()[0]).toBeInstanceOf(OrderCreated);
        // });
    });

    
    describe('addItem', () => {
        it('adds item to order', () => {
            const order = createDraftOrder();
            const productId = ProductId.from('prod-123').getValue();  
            const quantity = Quantity.create(2).getValue();           
            const price = Money.create('1', 100.00, 'USD').getAmount(); 

            order.addItem(productId, quantity, price);

            expect(order.getItems()).toHaveLength(1);
            expect(order.getItems()[0].getProductId()).toBe('prod-123');
            expect(order.getItems()[0].getQuantity()).toBe(2);
            expect(order.getItems()[0].getUnitPrice()).toBe(100.00);
        });

        it('increases quantity for existing item', () => {
            const order = createDraftOrder();
            const productId = ProductId.from('prod-123').getValue(); 
            const price = Money.create('1', 100.00, 'USD').getAmount(); 

            order.addItem(productId, 2, price);
            order.addItem(productId, 3, price);

            expect(order.getItems()).toHaveLength(1);
            expect(order.getItems()[0].getQuantity()).toBe(5);
        });
       
        it('throws when order is cancelled', () => {
            const order = createCancelledOrder();

            expect(() => order.addItem(
                ProductId.from('prod-123').getValue(), 
                2, 
                Money.create('1', 100.00, 'USD').getAmount()
            )).toThrow();
        });

        it('throws when quantity is zero', () => {
            const order = createDraftOrder();
            
            expect(() => order.addItem(
                ProductId.from('prod-123').getValue(), 
                0, 
                Money.create('1', 100.00, 'USD').getAmount()
            )).toThrow();
        });
    });
     /*
    describe('confirm', () => {
        it('changes status to confirmed', () => {
            const order = createDraftOrder();
            order.confirm();

            expect(order.status()).toBe(OrderStatus.Confirmed);
        });
        
        it('emits OrderConfirmed event', () => {
            const order = createOrderWithItems();
            order.confirm();
            const events = order.domainEvents();
            
            expect(events).toHaveLength(2);
            expect(events[1]).toBeInstanceOf(OrderConfirmed);
        });

        it('throws when order is empty', () => {
            const order = createDraftOrder();
            
            expect(() => order.confirm()).toThrow(EmptyOrderError);
        });

        it('throws when already confirmed', () => {
            const order = createOrderWithItems();
            order.confirm();

            expect(() => order.confirm()).toThrow(InvalidOrderStateError);
        });
    });

    describe('total', () => {
        it('calculates total amount for all items', () => {
            const order = createDraftOrder();
            order.addItem(ProductId.from('prod-123'), Quantity.create(2), Money.create('1', 100.00, 'USD'));
            order.addItem(ProductId.from('prod-456'), Quantity.create(1), Money.create('2', 50.00, 'USD'));

            const total = order.total();

            expect(total.getAmount()).toBe(250.00);
            expect(total.getCurrency()).toBe('USD');
        });
    });
    */

    // helpers
    function createDraftOrder(): Order {
        const customerId = CustomerId.create('cust-123');
        const order = Order.create(customerId);
        return order;
    }

    function createCancelledOrder(): Order {
        const order = createDraftOrder();
        order.cancel('Test cancellation');
        return order;
    }

    // function createConfirmedOrder(): Order {
    //     const order = createOrderWithItems();
    //     order.setShippingAddress(createTestAddress())
    //     order.confirm();
    //     return order;
    // }

    // function createOrderWithItems(): Order {
    //     const order = createDraftOrder();
    //     order.addItem('prod-123', 2, 100.00);
    //     order.addItem('prod-456', 1, 50.00);
    //     return order;
    // }
    
});