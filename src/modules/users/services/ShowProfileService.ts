import { injectable, inject } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: { user_id: string }): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) throw new AppError('User not found');

    return user;
  }
}
