const { EntitySchema } = require('typeorm');

const ProductSchema = new EntitySchema({
  name: 'Product',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true
    },
    name: {
      type: 'varchar'
    },
    price: {
      type: 'decimal',
      precision: 10,
      scale: 2
    },
    description: {
      type: 'text',
      nullable: true
    },
    restaurant_id: {
      type: 'int'
    }
  },
  relations: {
    restaurant: {
      type: 'many-to-one',
      target: 'Restaurant',
      joinColumn: { name: 'restaurant_id' }
    }
  }
});

module.exports = ProductSchema;

