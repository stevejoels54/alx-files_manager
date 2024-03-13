import { ObjectId } from 'mongodb';
import dbClient from './db';

class fileUtils {
  static async getFile(fileId) {
    try {
      // const file = await dbClient.files.findOne({ _id: fileId });
      const file = await dbClient.files.findOne({ _id: ObjectId(fileId) });
      return file;
    } catch (error) {
      throw new Error(`Error getting file: ${error.message}`);
    }
  }

  static async getFilesOfParentId(parentId) {
    try {
      const files = await dbClient.files.find({ parentId });
      return files;
    } catch (error) {
      throw new Error(`Error getting files of parent ID ${parentId}: ${error.message}`);
    }
  }

  static async createFile(fileData) {
    try {
      const newFile = await dbClient.files.insertOne(fileData);
      return newFile;
    } catch (error) {
      throw new Error(`Error creating file: ${error.message}`);
    }
  }
}

export default fileUtils;
