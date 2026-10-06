import { defineParameterType, Then, When } from '@cucumber/cucumber';

import { spicesDiscount } from '@sut/support/example-discounts';

import { ownDiscountsPage, type RequiredPiece, requiredPieces } from '../../support/discounts-page';
import type { PlaywrightWorld } from '../../support/playwright-world';

defineParameterType({
  name: 'requiredPiece',
  regexp: new RegExp(requiredPieces.map((piece) => piece.spoken).join('|')),
  transformer: (spoken: string) => requiredPieces.find((piece) => piece.spoken === spoken),
});

When('he leaves out {requiredPiece}', async function (this: PlaywrightWorld, piece: RequiredPiece) {
  await ownDiscountsPage(this).publishLeavingOut(spicesDiscount, piece);
});

Then('he is told {requiredPiece} is missing', async function (this: PlaywrightWorld, piece: RequiredPiece) {
  await ownDiscountsPage(this).verifyTellsIsMissing(piece);
});
