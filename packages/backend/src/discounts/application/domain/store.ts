export class Store {
  constructor(private readonly nameAndAddress: { storeName: string; storeAddress: string }) {}

  equals(other: Store): boolean {
    const { storeName, storeAddress } = other.nameAndAddress;
    return this.nameAndAddress.storeName === storeName && this.nameAndAddress.storeAddress === storeAddress;
  }

  toJSON() {
    return { ...this.nameAndAddress };
  }
}
