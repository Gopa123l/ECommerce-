const { EntitySchema } = require('typeorm');

const OrderSchema = new EntitySchema({
  name: 'Order',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true
    },
    userId: {
      type: 'int'
    },
    total_amount: {
      type: 'decimal',
      precision: 10,
      scale: 2
    },
    order_status: {
      type: 'varchar'
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
    },
    updated_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP'
    }
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'userId' }
    },
    orderItems: {
      type: 'one-to-many',
      target: 'OrderItem',
      inverseSide: 'order'
    }
  }
});

module.exports = OrderSchema;
