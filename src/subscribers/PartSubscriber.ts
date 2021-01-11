import { EventSubscriber, EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { Part } from '../entity/product.entity';

@EventSubscriber()
export class PartSubscriber implements EntitySubscriberInterface<Part> {
  listenTo() {
    return Part;
  }

  afterUpdate(event: UpdateEvent<any>) {
    event.updatedColumns;
  }
}
