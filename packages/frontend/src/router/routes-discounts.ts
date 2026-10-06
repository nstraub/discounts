import type { RouteRecordRaw } from 'vue-router';

import CountView from '../discounts/views/CountView.vue';
import DiscountsView from '../discounts/views/DiscountsView.vue';
import TillView from '../discounts/views/TillView.vue';

export const discountsRoutes: RouteRecordRaw[] = [
  { path: '/', component: DiscountsView },
  { path: '/till', component: TillView },
  { path: '/count', component: CountView },
];
