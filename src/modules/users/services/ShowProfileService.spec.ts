import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';
import AppError from '@shared/errors/AppError';

describe('ShowProfile', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let showProfile: ShowProfileService;

  const fakeData = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
  };

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show the profile', async () => {
    const { id: user_id } = await fakeUsersRepository.create(fakeData);

    const user = await showProfile.execute({ user_id });

    expect(user.name).toBe(fakeData.name);
    expect(user.email).toBe(fakeData.email);
  });

  it('should return error on profiling a non-existing user', async () => {
    await expect(
      showProfile.execute({ user_id: 'non-existing-user-id' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
