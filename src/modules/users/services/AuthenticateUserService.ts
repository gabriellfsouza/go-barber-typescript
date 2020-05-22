import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import authConfig from '@configs/authConfig';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

const { secret, expiresIn } = authConfig.jwt;

interface IRequestDTO {
  email: string;
  password: string;
}

// interface IResponseDTO {
//   user: User;
//   token: string;
// }
@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    email,
    password,
  }: IRequestDTO): Promise<{ user: User; token: string }> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('Incorrect email/password combinations', 401);

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched)
      throw new AppError('Incorrect email/password combinations', 401);

    const token = sign({}, secret, { subject: user.id, expiresIn });

    return { user, token };
  }
}

export default AuthenticateUserService;
