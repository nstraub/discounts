import assert from 'node:assert/strict';

import type { Page } from 'playwright';

type ExampleStore = { storeName: string; storeAddress: string };

export const pickTheStoreOf = async (page: Page, caption: string, discount: ExampleStore, pageShown: string): Promise<void> => {
  const store = `${discount.storeName}, ${discount.storeAddress}`;
  const picker = page.getByRole('combobox', { name: caption });
  const offered = picker.getByRole('option', { name: store });
  await offered.waitFor({ state: 'attached' }).catch(() => assert.fail(`${pageShown} offers no store ${store} to pick`));
  await picker.selectOption({ label: store });
};
