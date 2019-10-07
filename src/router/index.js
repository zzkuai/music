import Vue from 'vue';
import VueRouter from 'vue-router';

import discover from './module/discover.js';
import singer from './module/singer.js';
import search from './module/search.js';
import album from './module/album.js';
import play from './module/play.js';
import playlist from './module/playlist.js';

Vue.use(VueRouter);

export default new VueRouter({
    base: 'music',
    mode: 'history',
    linkActiveClass: 'active',
    linkExactActiveClass: 'exact-active',
    routes: [
        {
            path: '/',
            redirect: '/discover',
            meta: {
                home: true
            }
        },
        ...discover,
        ...singer,
        ...search,
        ...album,
        ...play,
        ...playlist,
        {
            path: '*',
            component: () => import('../page/404/NotFound')
        }
    ]
});
