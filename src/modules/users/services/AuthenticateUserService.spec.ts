import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

describe('CreateUser', () => {
  let fakeUserRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;

  let authenticateUser: AuthenticateUserService;

  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const fakeData = {
      email: 'johndoe@example.com',
      password: '123456',
    };

    const user = { name: 'John Doe', ...fakeData };

    await fakeUserRepository.create(user);

    const response = await authenticateUser.execute(fakeData);

    expect(response).toHaveProperty('token');
    expect(response.user).toMatchObject(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with a wrong password', async () => {
    const fakeData = {
      email: 'johndoe@example.com',
      password: '123456',
    };

    const user = { name: 'John Doe', ...fakeData };

    await fakeUserRepository.create(user);

    await expect(
      authenticateUser.execute({ ...fakeData, password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
