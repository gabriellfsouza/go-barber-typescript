import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

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
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const fakeData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    };

    const user = await createUser.execute(fakeData);

    expect(createUser.execute(fakeData)).rejects.toBeInstanceOf(AppError);
  });
});
