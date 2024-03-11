import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const uri = `mongodb://${host}:${port}/`;

    this.database = database;
    this.client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    try {
      await this.client.connect();
      const db = this.client.db(this.database);
      const users = db.collection('users');
      const count = await users.countDocuments();
      return count;
    } catch (error) {
      throw new Error(`Error counting users: ${error.message}`);
    }
  }

  async nbFiles() {
    try {
      await this.client.connect();
      const db = this.client.db(this.database);
      const files = db.collection('files');
      const count = await files.countDocuments();
      return count;
    } catch (error) {
      throw new Error(`Error counting files: ${error.message}`);
    }
  }
}

const dbClient = new DBClient();

export default dbClient;
