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

export const constraintsAndColumnsOfTheDiscountsTable = async (client: pg.Client) => {
  const constraints = await client.query("SELECT contype AS kind FROM pg_constraint WHERE conrelid = 'app.discounts'::regclass");
  const columns = await client.query(
    "SELECT column_name AS name, data_type AS type, is_nullable AS nullable FROM information_schema.columns WHERE table_schema = 'app' AND table_name = 'discounts'",
  );
  return { constraints: constraints.rows, columns: columns.rows };
};
