import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  date: Date;
  provider_id: string;
}

class CreateAppointmentService {
  // private appointmentsRepository: IAppointmentsRepository;

  // constructor(appointmentsRepository: IAppointmentsRepository) {
  //   this.appointmentsRepository = appointmentsRepository;
  // }

  constructor(private appointmentsRepository: IAppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public async execute({
    date,
    provider_id,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate)
      throw new AppError('This appointment is already booked');

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
