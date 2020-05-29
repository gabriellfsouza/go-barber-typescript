import ICreateNotificationDTO from '../dtos/INotificationDTO';
import Notification from '../infra/typeorm/schemas/Notifications';

export default interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<Notification>;
}
