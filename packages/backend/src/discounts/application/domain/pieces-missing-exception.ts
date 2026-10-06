export class PiecesMissingException extends Error {
  constructor(readonly pieces: readonly string[]) {
    super();
  }
}
