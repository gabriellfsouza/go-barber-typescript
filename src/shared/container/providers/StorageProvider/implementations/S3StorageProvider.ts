import fs from 'fs';
import path from 'path';
import aws, { S3 } from 'aws-sdk';
import uploadConfig from '@configs/uploadConfig';
import mime from 'mime';
import IStorageProvider from '../models/IStorageProvider';

const { Bucket } = uploadConfig.config.s3;

class DiskStorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3();
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.directory, file);

    const fileContent = await fs.promises.readFile(originalPath);

    const ContentType = mime.getType(originalPath) || undefined;

    await this.client
      .putObject({
        Bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
        ContentDisposition: `inline; filename=${file}`,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client.deleteObject({ Key: file, Bucket }).promise();
  }
}

export default DiskStorageProvider;
