import { queryAllByRole } from '@testing-library/dom';
import { mount } from '@vue/test-utils';
import { onTestFinished } from 'vitest';
import type { Component } from 'vue';

import { useDiscountsStore } from '@frontend/stores/discounts-store';
import { aTestingDiscountsStore } from '@sut/unit/frontend/stores/discounts-store/a-testing-discounts-store';

export const aFormOfferingTheStores = (form: Component, stores: ReadonlyArray<{ storeName: string; storeAddress: string }>) => {
  const { pinia, global } = aTestingDiscountsStore();
  const mounted = mount(form, { attachTo: document.body, props: { stores }, global });
  onTestFinished(() => mounted.unmount());
  return { form: mounted, discounts: useDiscountsStore(pinia) };
};

export const theStorePickersUnder = (caption: string) => queryAllByRole<HTMLSelectElement>(document.body, 'combobox', { name: caption });

export const theStoresOfferedUnder = (caption: string, name: string) =>
  theStorePickersUnder(caption).flatMap((picker) => queryAllByRole(picker, 'option', { name }));
