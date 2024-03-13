import { v4 as uuidv4 } from 'uuid';
import { promises as fsPromises } from 'fs';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import userUtils from '../utils/user';
import fileUtils from '../utils/file';

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

class FilesController {
  static async postUpload(req, res) {
    const token = req.header('X-Token');
    const {
      name,
      type,
      parentId = '0',
      isPublic = false,
      data,
    } = req.body;

    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    // Validate request parameters
    if (!name) return res.status(400).send({ error: 'Missing name' });
    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).send({ error: 'Missing type' });
    }
    if (type !== 'folder' && !data) return res.status(400).send({ error: 'Missing data' });

    // handle parentId validation
    if (parentId !== '0') {
      const parent = await fileUtils.getFile(parentId);
      if (!parent) return res.status(400).send({ error: 'Parent not found' });
      if (parent.type !== 'folder') return res.status(400).send({ error: 'Parent is not a folder' });
    }

    const userId = await userUtils.getUserIdAndKey(token);
    if (!userId) return res.status(401).send({ error: 'Unauthorized' });

    const user = await dbClient.users.findOne({ _id: ObjectId(userId) });
    if (!user) return res.status(401).send({ error: 'Unauthorized' });

    const file = {
      userId: ObjectId(userId),
      name,
      type,
      parentId: parentId === '0' ? parentId : ObjectId(parentId),
      isPublic,
    };

    try {
      if (type === 'folder') {
        const newFolder = await dbClient.files.insertOne(file);
        return res.status(201).json({
          ...newFolder.ops[0],
          id: newFolder.ops[0]._id,
          _id: undefined,
          localPath: undefined,
        });
      }

      //   save file locally and in db
      const fileId = uuidv4();
      const filePath = `${FOLDER_PATH}/${fileId}`;
      const fileContent = Buffer.from(data, 'base64');

      file.localPath = filePath;

      await fsPromises.mkdir(FOLDER_PATH, { recursive: true });
      await fsPromises.writeFile(filePath, fileContent);
      const newFile = await dbClient.files.insertOne(file);
      return res.status(201).json({
        ...newFile.ops[0],
        id: newFile.ops[0]._id,
        _id: undefined,
        localPath: undefined,
      });
    } catch (error) {
      return res.status(500).send({ error: 'Error uploading the file' });
    }
  }
}

export default FilesController;
