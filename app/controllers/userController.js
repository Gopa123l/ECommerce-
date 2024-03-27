const { getConnection } = require('../database.js');

exports.getAllUsers = async (req, res) => {
  try {
    const page = req.query.page || 1; 
    const pageSize = req.query.pageSize || 10; 
    const offset = (page - 1) * pageSize; 
    const connection = await getConnection();
    const users = await connection.query('SELECT * FROM "user" LIMIT $1 OFFSET $2', [pageSize, offset]);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const connection = getConnection();
    const user = await connection.query('SELECT * FROM "user" WHERE id = $1', [userId]);
    console.log(user)
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const connection = getConnection();
    const getExistingUser= await getUserByEmail(email)
    if(getExistingUser){
      return res.status(400).json({error: 'Email already in use'})
    }
    const result = await connection.query(
      'INSERT INTO "user" ("username", "email", "password") VALUES ($1, $2, $3) RETURNING *',
      [username, email, password]
    );
    console.log(result.length)
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserByEmail= async(email) => {
  const connection= await getConnection();
  const result= await connection.query('SELECT * FROM "user" where email=$1', [email]);
  console.log(result)
  return result[0];
}

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, password } = req.body;
    const connection = getConnection();
    const result = await connection.query(
      'UPDATE "user" SET "username" = $1, "email" = $2, "password" = $3 WHERE id = $4 RETURNING *',
      [username, email, password, userId]
    );
    console.log(result)
    if (result[0].length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const connection = getConnection();
    const result = await connection.query('DELETE FROM "User" WHERE id = $1 RETURNING *', [userId]);
    if (result[0].length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
