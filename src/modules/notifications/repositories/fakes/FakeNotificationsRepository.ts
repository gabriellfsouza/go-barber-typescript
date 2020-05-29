import Notification from '@modules/notifications/infra/typeorm/schemas/Notifications';
import ICreateNotificationDTO from '@modules/notifications/dtos/INotificationDTO';
import { ObjectID } from 'mongodb';
import INotificationsRepository from '../INotificationsRepository';

export default class FakeNotificationsRepository
  implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { content, recipient_id, id: new ObjectID() });

    this.notifications.push(notification);

    return notification;
  }
}
