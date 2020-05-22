import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    const authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const fakeData = {
      email: 'johndoe@example.com',
      password: '123456',
    };

    const user = { name: 'John Doe', ...fakeData };

    await createUser.execute(user);

    const response = await authenticateUser.execute(fakeData);

    expect(response).toHaveProperty('token');
    expect(response.user).toMatchObject(user);
  });

  // it('should not be able to create a new user with same email from another', async () => {
  //   const fakeUserRepository = new FakeUserRepository();
  //   const authenticateUser = new AuthenticateUserService(fakeUserRepository);

  //   const fakeData = {
  //     name: 'John Doe',
  //     email: 'johndoe@example.com',
  //     password: '123456',
  //   };

  //   const user = await authenticateUser.execute(fakeData);

  //   expect(authenticateUser.execute(fakeData)).rejects.toBeInstanceOf(AppError);
  // });

  // it('should not be able to create two appointments on the same time', async () => {
  //   const fakeUserRepository = new FakeUserRepository();
  //   const authenticateUser = new AuthenticateUserService(fakeUserRepository);

  //   const fakeData = { date: new Date(), provider_id: '123123123' };

  //   const appointment = await authenticateUser.execute(fakeData);

  //   expect(authenticateUser.execute(fakeData)).rejects.toBeInstanceOf(AppError);
  // });
});
