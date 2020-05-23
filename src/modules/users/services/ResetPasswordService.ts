import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  async execute({ token, password }: IRequest) {
    const userToken = await this.userTokensRepository.findByToken(token);
    if (!userToken) throw new AppError('User token does not exists');
    const user = await this.usersRepository.findById(userToken.user_id);
    if (!user) throw new AppError('User does not exists');

    user.password = password;
    await this.usersRepository.save(user);
  }
}
