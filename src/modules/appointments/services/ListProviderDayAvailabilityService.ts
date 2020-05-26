import { injectable, inject } from 'tsyringe';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import { getDaysInMonth, getDate, getHours } from 'date-fns';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) { }

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      { provider_id, day, month, year },
    );


    const hourStart = 8;
    const hourEnd = 17;

    const numberOfHoursInDay = hourEnd + 1 - hourStart;

    const eachHourArray = Array.from({ length: numberOfHoursInDay }, (_, index) =>
      index + hourStart
    );

    const availability = eachHourArray.map(hour => {
      const hasAppointmentsInHour = appointments.find(appointment =>
        getHours(appointment.date) === hour,
      )

      return {
        hour,
        available: !hasAppointmentsInHour,
      }
    });

    return availability;
  }
}
