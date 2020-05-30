import { container } from 'tsyringe';
import mailConfig from '@configs/mailConfig';
import EtherealMailProvider from './implementations/EtherealMailProvider';
import SESMailProvider from './implementations/SESMailProvider';
import IMailTemplateProvider from '../MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from '../MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';
import IMailProvider from './models/IMailProvider';

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
);

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
