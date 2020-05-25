import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

describe('ListProviders', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let listProviders: ListProvidersService;

  const fakeData = [
    {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    },
    {
      name: 'John Tré',
      email: 'johntre@example.com',
      password: '123456',
    },
    {
      name: 'John Qua',
      email: 'johnqua@example.com',
      password: '123456',
    },
  ];

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list providers', async () => {
    const [due, tre, loggedUser] = await Promise.all(
      fakeData.map(fake => fakeUsersRepository.create(fake)),
    );

    const providers = await listProviders.execute({ user_id: loggedUser.id });

    expect(providers).toEqual([due, tre]);
  });
});
