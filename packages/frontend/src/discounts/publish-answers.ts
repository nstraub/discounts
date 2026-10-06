import type { BadRequestException } from '@app/types/rest-api-refusals';

import type { Piece } from './publish-pieces';
import type { discountTexts } from './texts';

type DiscountTexts = typeof discountTexts;

export interface PublishAnswer {
  told(texts: DiscountTexts): string;
  toldOf(piece: Piece, texts: DiscountTexts): string;
}

export class NothingToldOfThePublish implements PublishAnswer {
  told(): string {
    return '';
  }

  toldOf(): string {
    return '';
  }
}

export class RateNotValid implements PublishAnswer {
  told(texts: DiscountTexts): string {
    return texts.rateNotValid;
  }

  toldOf(): string {
    return '';
  }
}

export class PiecesMissing implements PublishAnswer {
  constructor(private readonly pieces: readonly string[]) {}

  told(): string {
    return '';
  }

  toldOf(piece: Piece, texts: DiscountTexts): string {
    return piece.toldWhenAmong(this.pieces, texts);
  }
}

export const theAnswerTo = ({ missing, fields }: BadRequestException): PublishAnswer => {
  if (missing.length > 0) {
    return new PiecesMissing(missing);
  }
  if (fields.includes('rate')) {
    return new RateNotValid();
  }
  return new NothingToldOfThePublish();
};
