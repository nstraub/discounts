import type { INestApplication } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import type { DiscountPublicationRejected } from '@backend/discounts/application/domain/discount-publication-rejected';

export const publicationRejectionsHeardBy = (app: INestApplication): DiscountPublicationRejected[] => {
  const rejected: DiscountPublicationRejected[] = [];
  app.get(EventEmitter2).on('discount.publication-rejected', (event: DiscountPublicationRejected) => rejected.push(event));
  return rejected;
};
