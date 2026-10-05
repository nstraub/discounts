import { createRouter, createWebHashHistory } from 'vue-router';

import { discountsRoutes } from './routes-discounts';
import { greetingRoutes } from './routes-greeting';

const historyAReloadOfTheStaticallyServedAppKeeps = createWebHashHistory();

export const router = createRouter({
  history: historyAReloadOfTheStaticallyServedAppKeeps,
  routes: [...discountsRoutes, ...greetingRoutes],
});
