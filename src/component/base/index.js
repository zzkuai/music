import Vue from 'vue';

import BaseFont from './BaseFont';
import BaseState from './BaseState';
import BaseButton from './BaseButton';
import BaseNavBar from './BaseNavBar';
import BaseScroll from './BaseScroll';
import BaseLoading from './BaseLoading';
import BaseLoadMore from './BaseLoadMore';
import BaseReload from './BaseReload';
import BaseDialog from './BaseDialog';
import BaseModal from './BaseModal';
import BaseAvatar from './BaseAvatar';

Vue.component('base-font', BaseFont);
Vue.component('base-state', BaseState);
Vue.component('base-scroll', BaseScroll);
Vue.component('base-button', BaseButton);
Vue.component('base-nav-bar', BaseNavBar);
Vue.component('base-loading', BaseLoading);
Vue.component('base-load-more', BaseLoadMore);
Vue.component('base-reload', BaseReload);
Vue.component('base-dialog', BaseDialog);
Vue.component('base-modal', BaseModal);
Vue.component('base-avatar', BaseAvatar);

// const context = require.context('.', false, /\.vue$/);
// context.keys().forEach(fileName => {
//     const component = context(fileName).default;
//     const componentName = fileName.split('/').pop().replace(/\.\w+$/, '');
//     Vue.component(componentName, component);
// });
