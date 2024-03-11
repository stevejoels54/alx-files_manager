import { MongoClient } from 'mongodb';

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';
const uri = `mongodb://${host}:${port}/`;

class DBClient {
  constructor() {
    MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        console.log(err.message);
        this.client = false;
      } else {
        this.client = client.db(database);
        this.users = this.client.collection('users');
        this.files = this.client.collection('files');
      }
    });
  }

  isAlive() {
    return Boolean(this.client);
  }

  async nbUsers() {
    return this.users.countDocuments();
  }

  async nbFiles() {
    return this.files.countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
