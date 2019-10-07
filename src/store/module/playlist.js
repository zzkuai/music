import { getPlayListDetail, getPlayListCat, getPlayListComment, getPlayList, getPlayListHigh } from '@/api/page/playlist';

// state
const state = {
    load: false,
    list: {}, // 网友精选歌单
    high: {}, // 精品歌单
    detail: {}, // 歌单详情
    comment: {}, // 歌单评论
    category: [], // 标签分类
    userCategory: [], // 用户已选标签
};

// getters
const getters = {
    getPlayListOfList: ({ list }) => (category) => list[ category ],
    getPlayListOfHigh: ({ high }) => (category) => high[ category ],
    getPlayListById: ({ detail }) => (id) => detail[ id ].info,
    getPlayListSongById: ({ detail }) => (id) => detail[ id ].songs,
    getPlayListCreatorById: ({ detail }) => (id) => detail[ id ].creator,
    getPlayListSubscriberById: ({ detail }) => (id) => detail[ id ].subscriber,
    getPlayListCommentById: ({ comment }) => (id) => comment[ id ],
};

// mutations type
const SET_PLAY_LIST = 'SET_PLAY_LIST';
const SET_PLAY_LIST_LOAD = 'SET_PLAY_LIST_LOAD';
const SET_PLAY_LIST_HIGH = 'SET_PLAY_LIST_HIGH';
const SET_PLAY_LIST_DETAIL = 'SET_PLAY_LIST_DETAIL';
const SET_PLAY_LIST_COMMENT = 'SET_PLAY_LIST_COMMENT';
const SET_PLAY_LIST_CATEGORY = 'SET_PLAY_LIST_CATEGORY';
const SET_PLAY_LIST_USER_CATEGORY = 'SET_PLAY_LIST_USER_CATEGORY';

// mutations
const mutations = {
    [ SET_PLAY_LIST ](state, payload) {
        const { cat, more, playlists, total } = payload;
        if (!state.list[ cat ]) state.list[ cat ] = {};
        const list = playlists.map(({ id, name, coverImgUrl, playCount }) => ({ id, name, coverImgUrl, playCount }));
        state.list[ cat ] = { list, more, total };
    },
    [ SET_PLAY_LIST_HIGH ](state, payload) {
        const { cat, more, playlists, total, lasttime } = payload;
        if (!state.high[ cat ]) state.high[ cat ] = {};
        const list = playlists.map(({ id, name, coverImgUrl, playCount }) => ({ id, name, coverImgUrl, playCount }));
        state.high[ cat ] = { list, more, total, lasttime };
    },
    [ SET_PLAY_LIST_LOAD ](state, payload) {
        state.load = payload;
    },
    [ SET_PLAY_LIST_DETAIL ](state, payload) {
        const { id, result } = payload;
        const { detail, creator, subscriber, songs } = result;
        if (!state.detail[ id ]) state.detail[ id ] = {};
        state.detail[ id ].songs = songs.map(({ id, name, al, alia, ar }) => {
            return { id, name, alia, artist: ar, album: al };
        });
        state.detail[ id ].info = detail;
        state.detail[ id ].creator = creator;
        state.detail[ id ].subscriber = subscriber;
    },
    [ SET_PLAY_LIST_COMMENT ](state, payload) {
        const { id, ...comment } = payload;
        if (!state.comment[ id ]) state.comment[ id ] = {};
        state.comment[ id ] = comment;
    },
    [ SET_PLAY_LIST_CATEGORY ](state, payload) {
        state.category = payload;
    },
    [ SET_PLAY_LIST_USER_CATEGORY ](state, payload) {
        state.userCategory = payload;
    }
};

// actions
const actions = {
    async setPlayList({ commit, state }, payload) {
        try {
            const { category, reload } = payload;
            if ((state.list[ category ] && reload) || (state.list[ category ] && !state.list[ category ].more)) return;
            let offset = state.list[ category ]?.list?.length || 0;
            if (offset > 0) await commit(SET_PLAY_LIST_LOAD, true);
            let result = await getPlayList({ offset, cat: category });
            if (offset > 0) {
                result.playlists = state.list[ category ].list.concat(result.playlists);
            }
            if (state.load) await commit(SET_PLAY_LIST_LOAD, false);
            await commit(SET_PLAY_LIST, Object.freeze(result));
        } catch (e) {
            throw e;
        }
    },
    async setPlayListHigh({ commit, state }, payload) {
        try {
            const { category, reload } = payload;
            if ((state.high[ category ] && reload) || (state.high[ category ] && !state.high[ category ].more)) return;
            const lasttime = state.high[ category ]?.lasttime;
            if (lasttime) await commit(SET_PLAY_LIST_LOAD, true);
            let result = await getPlayListHigh({ cat: category, before: lasttime || '' });
            if (lasttime) {
                result.playlists = state.high[ category ].list.concat(result.playlists);
            }
            if (state.load) await commit(SET_PLAY_LIST_LOAD, false);
            await commit(SET_PLAY_LIST_HIGH, Object.freeze({ ...result, cat: category }));
        } catch (e) {
            throw e;
        }
    },
    async setPlayListDetail({ commit, state }, payload) {
        try {
            if (state.detail[ payload ]) return;
            const { playlist } = await getPlayListDetail(payload);
            const { creator, tracks: songs, subscribers, subscribedCount, ...detail } = playlist;
            const subscriber = { list: subscribers, count: subscribedCount };
            const result = Object.freeze({ detail, creator, songs, subscriber });
            await commit(SET_PLAY_LIST_DETAIL, { id: payload, result });
        } catch (e) {
            throw e;
        }
    },
    async setPlayListComment({ commit, state }, payload) {
        try {
            if (state.comment[ payload ]) return;
            const { more, comments, hotComments, total } = await getPlayListComment(payload);
            await commit(SET_PLAY_LIST_COMMENT, { id: payload, more, comments, hotComments, total });
        } catch (e) {
            throw e;
        }
    },
    async setPlayListCategory({ commit, state, dispatch }) {
        try {
            if (state.category.length > 0) return;
            const { categories, sub } = await getPlayListCat();
            const catObj = {};
            const subSet = new Set(sub);
            for (let [ key, value ] of Object.entries(categories)) {
                catObj[ +key ] = { category: +key, name: value, subs: [] };
            }
            for (let value of subSet.values()) {
                const { category } = value;
                catObj[ category ].subs.push(value);
            }
            const catArr = Object.values(catObj);
            await commit(SET_PLAY_LIST_CATEGORY, catArr);
            const subArr = [ { name: '推荐', fixed: true }, { name: '精品', fixed: true } ].concat(sub.filter((item, index) => index < 4));
            dispatch('setPlayListUserCategory', subArr);
        } catch (e) {
            throw e;
        }
    },
    async setPlayListUserCategory({ commit }, payload) {
        commit(SET_PLAY_LIST_USER_CATEGORY, payload);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
