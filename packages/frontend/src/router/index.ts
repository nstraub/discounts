import { createRouter, createWebHashHistory } from 'vue-router';

import { greetingRoutes } from './routes-greeting';

const historyAReloadOfTheStaticallyServedAppKeeps = createWebHashHistory();

export const router = createRouter({
  history: historyAReloadOfTheStaticallyServedAppKeeps,
  routes: [{ path: '/', redirect: '/walking-skeleton' }, ...greetingRoutes],
});
