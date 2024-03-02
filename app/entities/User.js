const { EntitySchema } = require('typeorm');
const UserSchema = new EntitySchema({
  name: 'User',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true
    },
    username: {
      type: 'varchar'
    },
    email: {
      type: 'varchar'
    },
    password: {
      type: 'varchar'
    }
  }
});

module.exports = UserSchema;