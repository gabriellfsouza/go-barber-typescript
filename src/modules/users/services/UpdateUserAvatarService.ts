import { injectable, inject } from 'tsyringe';

import uploadConfig from '@configs/uploadConfig';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  async execute({ user_id, avatarFilename }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user)
      throw new AppError('Only authenticated users can change the avatar', 401);

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }
    const filename = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = filename;
    await this.usersRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;
