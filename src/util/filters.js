import Vue from 'vue';
import {
  numberFormat,
  readCountFormat,
  playTimeFormat,
  dateFormat,
  commentTimeFormat,
} from '@/util/format';

Vue.filter('numberFormat', numberFormat);
Vue.filter('readCountFormat', readCountFormat);
Vue.filter('playTimeFormat', playTimeFormat);
Vue.filter('dateFormat', dateFormat);
Vue.filter('commentTimeFormat', commentTimeFormat);
