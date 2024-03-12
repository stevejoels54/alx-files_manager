import sha1 from 'sha1';
// import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) return res.status(400).send({ error: 'Missing email' });
    if (!password) return res.status(400).send({ error: 'Missing password' });

    const userExists = await dbClient.users.findOne({ email });
    if (userExists) return res.status(400).send({ error: 'Already exist' });

    // catch errors that can be thrown by insertOne
    try {
      const result = await dbClient.users.insertOne({
        email,
        password: sha1(password),
      });
      return res.status(201).send({
        id: result.insertedId,
        email,
      });
    } catch (error) {
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
