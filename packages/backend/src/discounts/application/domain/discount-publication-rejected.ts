export class DiscountPublicationRejected {
  readonly name = 'discount.publication-rejected';

  constructor(
    readonly rate: string,
    readonly reason: string,
    readonly pieces: readonly string[],
  ) {}
}
