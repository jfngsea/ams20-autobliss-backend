import { EventSubscriber, EntitySubscriberInterface, UpdateEvent, getRepository, InsertEvent } from 'typeorm';
import { Part } from '../entity/product.entity';
import { Subscription } from '../entity/subscription.entity';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { MailOptions } from 'nodemailer/lib/json-transport';

@EventSubscriber()
export class PartSubscriber implements EntitySubscriberInterface<Part> {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
          user: "autobliss@outlook.pt",
          pass: "blissauto2020"
      }
  });
  }

  listenTo() {
    return Part;
  }

  afterInsert(event: InsertEvent<Part>) {
    //console.log(event.metadata.generatedColumns);
    console.log('part inserted');
  }

 async afterUpdate(event: UpdateEvent<Part>) {
    console.log("part updated")
    const cols = event.updatedColumns.map( metadata => metadata.propertyName);
    const part = event.entity;

    let mail: MailOptions;

    if(cols.includes('price')){
      const mails = await this.getEmails(event);
      if(mails.length > 0){
        mail = {
        from:'autobliss@outlook.pt',
        to:mails,
        subject: `Peça #${part.id}: ${part.name} teve uma alteração de preço`,
        text:`Houve uma alteração de preço na peça #${part.id}: ${part.name} para ${part.price}.\n AutoBliss`
      }
      await this.transporter.sendMail(mail);
      }
      
    } else if (cols.includes('quantity')) {
      const mails = await this.getEmails(event);
      if(mails.length > 0){
        mail = {
          from:'autobliss@outlook.pt',
          to:mails,
          subject: `Peça #${part.id}: ${part.name} teve uma alteração de quantidade`,
          text:`Houve uma alteração de quantidade na peça #${part.id}: ${part.name} para ${part.quantity}.\n AutoBliss`
        }
        await this.transporter.sendMail(mail);
      }
    }
  }

  private async getEmails(event: UpdateEvent<Part>): Promise<string[]>{
    const subRepo = getRepository(Subscription);
    const subs = await subRepo.find({partId: event.entity.id});
    const emails = subs.map(sub => sub.userEmail);
    console.log(emails);
    return emails;
  }
}
