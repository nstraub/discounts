import type { RouteRecordRaw } from 'vue-router';

import DiscountsView from '../discounts/views/DiscountsView.vue';
import TillView from '../discounts/views/TillView.vue';

export const discountsRoutes: RouteRecordRaw[] = [
  { path: '/', component: DiscountsView },
  { path: '/till', component: TillView },
];
