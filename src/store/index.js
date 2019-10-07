import Vue from 'vue';
import Vuex from 'vuex';
import discover from './module/discover';
import search from './module/search';
import singer from './module/singer';
import player from './module/player';
import album from './module/album';
import playlist from './module/playlist';

Vue.use(Vuex);

// state
const state = {
    theme: new Date().getHours() >= 19 || new Date().getHours() <= 7 ? 'night' : 'day', // 根据当前时间设置主题
    loadVisible: false,
    menuVisible: false,
    playerVisible: false,
    playlistVisible: false,
};

// mutations type
const SET_THEME = 'SET_THEME';
const SET_LOAD_VISIBLE = 'SET_LOAD_VISIBLE';
const SET_MENU_VISIBLE = 'SET_MENU_VISIBLE';
const SET_PLAYER_VISIBLE = 'SET_PLAYER_VISIBLE';
const SET_PLAY_LIST_VISIBLE = 'SET_PLAY_LIST_VISIBLE';

// mutations
const mutations = {
    [ SET_THEME ](state, visible) {
        state.theme = visible;
    },
    [ SET_LOAD_VISIBLE ](state, visible) {
        state.loadVisible = visible;
    },
    [ SET_MENU_VISIBLE ](state, visible) {
        state.menuVisible = visible;
    },
    [ SET_PLAYER_VISIBLE ](state, visible) {
        state.playerVisible = visible;
    },
    [ SET_PLAY_LIST_VISIBLE ](state, visible) {
        state.playlistVisible = visible;
    },
};

// actions
const actions = {
    async setTheme({ commit }, theme) {
        await commit(SET_THEME, theme);
    },
    async setLoadVisible({ commit, state }, visible) {
        if (state.loadVisible === visible) return;
        await commit(SET_LOAD_VISIBLE, visible);
    },
    async setMenuVisible({ commit }, visible) {
        await commit(SET_MENU_VISIBLE, visible);
    },
    async setPlayerVisible({ commit, state }, visible) {
        if (state.playerVisible === visible) return;
        await commit(SET_PLAYER_VISIBLE, visible);
    },
    async setPlayListVisible({ commit }, visible) {
        await commit(SET_PLAY_LIST_VISIBLE, visible);
    },
};

export default new Vuex.Store({
    state,
    mutations,
    actions,
    modules: {
        discover,
        search,
        singer,
        player,
        album,
        playlist
    }
});
