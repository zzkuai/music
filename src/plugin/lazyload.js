import Vue from 'vue';
import VueLazyLoad from 'vue-lazyload';
import store from '@/store/index';

Vue.use(VueLazyLoad, {
    attempt: 1,
    loading: store.state.theme === 'day' ?
        require(`../asset/images/lazyload_day.png`) : require(`../asset/images/lazyload_night.png`)
});
