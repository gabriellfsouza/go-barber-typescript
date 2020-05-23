import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

describe('SendForgotPasswordEmail', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeMailProvider: FakeMailProvider;
  let fakeUserTokensRepository: FakeUserTokensRepository;
  let sendForgotPasswordEmail: SendForgotPasswordEmailService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const fakeData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    };

    const { email } = await fakeUsersRepository.create(fakeData);

    await sendForgotPasswordEmail.execute({ email });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const fakeData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    };

    await expect(
      sendForgotPasswordEmail.execute({ email: fakeData.email }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    const generate = jest.spyOn(fakeUserTokensRepository, 'generate');

    const fakeData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    };

    const { email, id } = await fakeUsersRepository.create(fakeData);

    await sendForgotPasswordEmail.execute({ email });

    expect(sendMail).toHaveBeenCalled();
    expect(generate).toHaveBeenCalledWith(id);
  });
});
