import multer, { StorageEngine } from 'multer';
import crypto from 'crypto';
import { resolve } from 'path';

const tmpFolder = resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';
  directory: string;
  uploadsFolder: string;
  multer: {
    storage: StorageEngine;
  };
  config: {
    disk: {};
    s3: { Bucket: string };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER || 'disk',
  directory: tmpFolder,
  uploadsFolder: resolve(tmpFolder, 'uploads'),
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('HEX');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },
  config: {
    disk: {},
    s3: {
      Bucket: process.env.AWS_BUCKET,
    },
  },
} as IUploadConfig;
