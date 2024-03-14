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
      if (!ObjectId.isValid(parentId)) return res.status(400).send({ error: 'Parent not found' });
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

  static async getShow(req, res) {
    const fileId = req.params.id;
    const token = req.header('X-Token');

    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    if (!ObjectId.isValid(fileId)) return res.status(404).send({ error: 'Not found' });

    const file = await fileUtils.getFile(fileId);
    if (!file) return res.status(404).send({ error: 'Not found' });

    if (file.isPublic) return res.status(200).json(file);

    const userId = await userUtils.getUserIdAndKey(token);
    if (!userId) return res.status(401).send({ error: 'Unauthorized' });

    if (file.userId.toString() !== userId) return res.status(404).send({ error: 'Not found' });

    return res.status(200).json({
      ...file,
      id: file._id,
      _id: undefined,
      localPath: undefined,
    });
  }

  static async getIndex(req, res) {
    const token = req.header('X-Token');
    // const { parentId = '0', page = 0 } = req.query;

    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    const userId = await userUtils.getUserIdAndKey(token);
    if (!userId) return res.status(401).send({ error: 'Unauthorized' });

    const user = await dbClient.users.findOne({ _id: ObjectId(userId) });
    if (!user) return res.status(401).send({ error: 'Unauthorized' });

    const parentId = req.query.parentId || '0';
    const page = /^\d+$/.test(req.query.page) ? parseInt(req.query.page, 10) : 0;
    const PAGE_SIZE = 20;
    const skip = page * PAGE_SIZE;

    try {
      const filesFilter = {
        userId: userId.toString(),
        parentId: parentId === '0' ? parentId : new ObjectId(parentId),
      };

      const files = await dbClient.files.aggregate([
        { $match: filesFilter },
        { $sort: { _id: -1 } },
        { $skip: skip },
        { $limit: PAGE_SIZE },
        {
          $project: {
            _id: 0,
            id: '$_id',
            userId: 1,
            name: 1,
            type: 1,
            isPublic: 1,
            parentId: {
              $cond: { if: { $eq: ['$parentId', '0'] }, then: 0, else: '$parentId' },
            },
          },
        },
      ]).toArray();

      return res.status(200).json(files);
    } catch (error) {
      console.error('Error retrieving files:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default FilesController;