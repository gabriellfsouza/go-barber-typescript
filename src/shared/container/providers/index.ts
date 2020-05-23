import { container } from 'tsyringe';

import IStorageProvider from './StorageProvider/model/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

// import IMailProvider from './MailProvider/models/IMailProvider';
// import IMailProvider from './MailProvider/implementations/';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);
