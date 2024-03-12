// a class with user methods that are used in the controllers and routes
import redisClient from './redis';
import dbClient from './db';

class userUtils {
  static async getUserIdAndKey(token) {
    const userId = await redisClient.get(`auth_${token}`);
    return userId;
  }

  static async getUser(query) {
    const user = await dbClient.users.findOne(query);
    return user;
  }
}

export default userUtils;
