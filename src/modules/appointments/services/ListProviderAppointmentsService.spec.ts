import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

describe('ListProviderAppointments', () => {
  let fakeAppointmentsRepository: FakeAppointmentsRepository;
  let listProviderAppointments: ListProviderAppointmentsService;

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the appointments from specific day', async () => {
    const queryData = {
      day: 20,
      month: 5,
      year: 2020,
    };

    const fakeData = {
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(
        queryData.year,
        queryData.month - 1,
        queryData.day,
        14,
        0,
        0,
        0,
      ),
    };

    const appointment1 = await fakeAppointmentsRepository.create(fakeData);
    const appointment2 = await fakeAppointmentsRepository.create({
      ...fakeData,
      date: new Date(
        queryData.year,
        queryData.month - 1,
        queryData.day,
        15,
        0,
        0,
        0,
      ),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: fakeData.provider_id,
      ...queryData,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
