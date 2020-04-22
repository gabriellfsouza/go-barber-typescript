import { getRepository } from 'typeorm';
import { join } from 'path';
import { promises } from 'fs';

import uploadConfig from '../configs/uploadConfig';
import User from '../models/User';

interface RequestDTO {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  async execute({ user_id, avatarFilename }: RequestDTO): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);
    if (!user)
      throw new Error('Only authenticated users can change the avatar');

    if (user.avatar) {
      const avatarFilePath = join(uploadConfig.directory, user.avatar);
      try {
        const userAvatarFileExists = await promises.stat(avatarFilePath);
        if (userAvatarFileExists) await promises.unlink(avatarFilePath);
      } catch {
        console.log('file not found');
      }
    }

    user.avatar = avatarFilename;
    await usersRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;
