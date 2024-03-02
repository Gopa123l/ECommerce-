const { EntitySchema } = require('typeorm');

const RestaurantSchema = new EntitySchema({
  name: 'Restaurant',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true
    },
    name: {
      type: 'varchar'
    },
    address: {
      type: 'varchar'
    },
    contact_number: {
      type: 'varchar'
    }
  }
});

module.exports = RestaurantSchema;

