import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';
import authConfig from '@configs/authConfig';
import User from '../infra/typeorm/entities/User';

const { secret, expiresIn } = authConfig.jwt;

interface RequestDTO {
  email: string;
  password: string;
}

// interface ResponseDTO {
//   user: User;
//   token: string;
// }

class AuthenticateUserService {
  public async execute({
    email,
    password,
  }: RequestDTO): Promise<{ user: User; token: string }> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) throw new AppError('Incorrect email/password combinations', 401);

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched)
      throw new AppError('Incorrect email/password combinations', 401);

    const token = sign({}, secret, { subject: user.id, expiresIn });

    return { user, token };
  }
}

export default AuthenticateUserService;
