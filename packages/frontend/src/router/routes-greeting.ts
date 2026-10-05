import type { RouteRecordRaw } from 'vue-router';

import GreetingView from '../greeting/views/GreetingView.vue';

export const greetingRoutes: RouteRecordRaw[] = [{ path: '/walking-skeleton', component: GreetingView }];
