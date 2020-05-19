import { join } from 'path';
import { promises } from 'fs';

import uploadConfig from '@configs/uploadConfig';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ user_id, avatarFilename }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user)
      throw new AppError('Only authenticated users can change the avatar', 401);

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
    await this.usersRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;
