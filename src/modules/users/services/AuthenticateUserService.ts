import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';
import authConfig from '@configs/authConfig';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

const { secret, expiresIn } = authConfig.jwt;

interface IRequestDTO {
  email: string;
  password: string;
}

// interface IResponseDTO {
//   user: User;
//   token: string;
// }

class AuthenticateUserService {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({
    email,
    password,
  }: IRequestDTO): Promise<{ user: User; token: string }> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('Incorrect email/password combinations', 401);

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched)
      throw new AppError('Incorrect email/password combinations', 401);

    const token = sign({}, secret, { subject: user.id, expiresIn });

    return { user, token };
  }
}

export default AuthenticateUserService;
