import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import { MongoRepository, getMongoRepository } from 'typeorm';
import ICreateNotificationDTO from '@modules/notifications/dtos/INotificationDTO';
import Notification from '../schemas/Notifications';

export default class NotificationsRepository
  implements INotificationsRepository {
  private ormMongoRepository: MongoRepository<Notification>;

  constructor() {
    this.ormMongoRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormMongoRepository.create({
      recipient_id,
      content,
    });

    await this.ormMongoRepository.save(notification);
    return notification;
  }
}
