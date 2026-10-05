import './style.css';

import { createApp } from 'vue';

import { FetchRestApi } from '@app/types/rest-api';

import App from './App.vue';
import { restApiKey } from './rest-api-key';
import { router } from './router';

createApp(App).use(router).provide(restApiKey, new FetchRestApi(import.meta.env.VITE_API_URL)).mount('#app');
