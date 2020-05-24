import { inject, injectable } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';

import IMailProvider from '../models/IMailProvider';
import ISendMailDTO, { IMailContact } from '../dtos/ISendMailDTO';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    (async () => {
      const account = await nodemailer.createTestAccount();
      const { host, port, secure } = account.smtp;
      const { user, pass } = account;

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });

      this.client = transporter;
    })();
  }

  public async sendMail({
    to,
    subject,
    from,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const contactToSub = (contact: IMailContact) => ({
      name: contact.name,
      address: contact.email,
    });
    const message = await this.client.sendMail({
      from: from
        ? contactToSub(from)
        : 'Equipe GoBarber <equipe@gobarber.com.br>',
      to: Array.isArray(to) ? to.map(contactToSub) : contactToSub(to),
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
