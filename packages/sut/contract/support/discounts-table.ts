import type pg from 'pg';

const aDiscountRow = { id: "'constraint-id'", item: "'Peruvian spices'", rate: '20', store_name: "'Mike''s Groceries'", store_address: "'12 Market Street'" };

export const insertADiscountWithout = (client: pg.Client, missing: keyof typeof aDiscountRow): Promise<string> => {
  const given = Object.entries(aDiscountRow).filter(([column]) => column !== missing);
  const columns = given.map(([column]) => column).join(', ');
  const values = given.map(([, value]) => value).join(', ');
  return client.query(`INSERT INTO app.discounts (${columns}) VALUES (${values})`).then(
    () => 'accepted',
    (refusal: { code: string }) => refusal.code,
  );
};
