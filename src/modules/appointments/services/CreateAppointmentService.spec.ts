import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import { startOfHour } from 'date-fns';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

describe('CreateAppointment', () => {
  let fakeAppointmentsRepository: FakeAppointmentsRepository;
  let createAppointment: CreateAppointmentService;

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const fakeData = { date: new Date(), provider_id: '123123123' };

    const appointment = await createAppointment.execute(fakeData);

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(fakeData.provider_id);
    expect(appointment.date.toISOString()).toBe(
      startOfHour(fakeData.date).toISOString(),
    );
  });

  it('should not be able to create two appointments on the same time', async () => {
    const fakeData = { date: new Date(), provider_id: '123123123' };

    const appointment = await createAppointment.execute(fakeData);

    await expect(createAppointment.execute(fakeData)).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
