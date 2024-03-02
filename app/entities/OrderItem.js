const { EntitySchema } = require('typeorm');

const OrderItemSchema = new EntitySchema({
  name: 'OrderItem',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true
    },
    orderId: {
      type: 'int'
    },
    productId: {
      type: 'int'
    },
    quantity: {
      type: 'int'
    },
    price_per_unit: {
      type: 'decimal',
      precision: 10,
      scale: 2
    },
    total_price: {
      type: 'decimal',
      precision: 10,
      scale: 2
    }
  },
  relations: {
    order: {
      type: 'many-to-one',
      target: 'Order',
      joinColumn: { name: 'orderId' }
    },
    product: {
      type: 'many-to-one',
      target: 'Product',
      joinColumn: { name: 'productId' }
    }
  }
});

module.exports = OrderItemSchema;
