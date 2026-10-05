import type { RouteRecordRaw } from 'vue-router';

import DiscountsView from '../discounts/views/DiscountsView.vue';

export const discountsRoutes: RouteRecordRaw[] = [{ path: '/', component: DiscountsView }];
