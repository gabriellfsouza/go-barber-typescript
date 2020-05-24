import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';
import AppError from '@shared/errors/AppError';

describe('UpdateProfile', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let updateProfile: UpdateProfileService;

  const fakeData = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
  };

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create(fakeData);

    const updateData = {
      user_id: user.id,
      name: 'John Tré',
      email: 'johntre@example.com',
    };

    const updatedUser = await updateProfile.execute(updateData);

    expect(updatedUser.name).toBe(updateData.name);
  });

  it('should not be able to change the email to an email used by another user', async () => {
    await fakeUsersRepository.create(fakeData);

    const userData = {
      name: 'John Tré',
      email: 'johntre@example.com',
      password: '123456',
    };

    const user = await fakeUsersRepository.create(userData);

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Test',
        email: fakeData.email,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create(fakeData);

    const userData = {
      user_id: user.id,
      name: 'John Tré',
      email: 'johntre@example.com',
      password: '123123',
      old_password: '123456',
    };

    const updatedUser = await updateProfile.execute(userData);

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create(fakeData);

    const userData = {
      user_id: user.id,
      name: 'John Tré',
      email: 'johntre@example.com',
      password: '123123',
    };

    const promise = updateProfile.execute(userData);

    await expect(promise).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with a wrong password', async () => {
    const user = await fakeUsersRepository.create(fakeData);

    const userData = {
      user_id: user.id,
      name: 'John Tré',
      email: 'johntre@example.com',
      password: '123123',
      old_password: 'wrong-password',
    };

    const promise = updateProfile.execute(userData);

    await expect(promise).rejects.toBeInstanceOf(AppError);
  });

  it('should return error on update a non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        email: 'test@example.com',
        name: 'Test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
