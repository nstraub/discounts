export class Store {
  constructor(private readonly nameAndAddress: { storeName: string; storeAddress: string }) {}

  toJSON() {
    return { ...this.nameAndAddress };
  }
}
