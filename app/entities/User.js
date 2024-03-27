const { EntitySchema } = require('typeorm');
const bcrypt = require('bcrypt');

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
  },
  /*checks: [    
    { expression: `email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`, name: 'valid_email_format' }
  ]*/
});

module.exports = UserSchema;