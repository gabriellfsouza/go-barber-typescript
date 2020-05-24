import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUser', () => {
  let fakeUserRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let createUser: CreateUserService;

  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const fakeData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    };

    const user = await createUser.execute(fakeData);

    expect(user).toHaveProperty('id');
    expect(user.name).toBe(fakeData.name);
    expect(user.email).toBe(fakeData.email);
  });

  it('should not be able to create a new user with same email from another', async () => {
    const fakeData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    };

    const user = await createUser.execute(fakeData);

    await expect(createUser.execute(fakeData)).rejects.toBeInstanceOf(AppError);
  });
});
