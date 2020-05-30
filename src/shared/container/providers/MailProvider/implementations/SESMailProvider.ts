import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import aws from 'aws-sdk';
import mailConfig from '@configs/mailConfig';
import ISendMailDTO, { IMailContact } from '../dtos/ISendMailDTO';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class SESMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
      }),
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const contactToSub = (contact: IMailContact) => ({
      name: contact.name,
      address: contact.email,
    });
    await this.client.sendMail({
      from: from ? contactToSub(from) : contactToSub(mailConfig.defaults.from),
      to: Array.isArray(to) ? to.map(contactToSub) : contactToSub(to),
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}
