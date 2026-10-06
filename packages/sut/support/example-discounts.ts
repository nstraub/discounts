export const spicesDiscount = { item: 'Peruvian spices', rate: '20', storeName: "Mike's Groceries", storeAddress: '12 Market Street' };

export const produceDiscount = { item: 'Fresh produce', rate: '10', storeName: 'Corner Grocery', storeAddress: '3 Hill Road' };

export const stephaniesProduceDiscount = { item: 'Organic produce', rate: '15', storeName: "Stephanie's Market", storeAddress: '8 Orchard Lane' };

export const longTextInAnyCharacters = {
  item: 'Ají panca 🌶️ '.repeat(1_000),
  storeName: "D'Ángelo's <b>Bodega</b>",
  storeAddress: 'Calle Ñuñoa 4; piso 2 '.repeat(500),
};

export const publishedSpicesDiscount = { id: 'spices-id', ...spicesDiscount };

export const publishedProduceDiscount = { id: 'produce-id', ...produceDiscount };

export const spicesDiscountWithItsHook = { ...spicesDiscount, hook: 'Our spices now come from a new supplier' };

export const couponForTheSpicesDiscount = { token: '7K3QX9M2PD', storeName: spicesDiscount.storeName };
