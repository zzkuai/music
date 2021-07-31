import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import { IS_DEV } from '@/api/env';

import '@/plugin';
import '@/util';
import '@/component';
import '@/asset/style/base/base.scss';

Vue.config.productionTip = false;
Vue.config.errorHandler = function (err) {
  if (IS_DEV) {
    console.error(err);
  }
};

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
