import { getAlbum, getAlbumList, getAlbumComment } from '@/api/page/album';

// state
const state = {
    load: false,
    album: {},
    list: {},
    comment: {}
};

// getters
const getters = {
    getAlbumById: ({ album }) => (id) => album[ id ].detail,
    getAlbumSongById: ({ album }) => (id) => album[ id ].songs,
    getAlbumCommentById: ({ comment }) => (id) => comment[ id ],
};

// mutations type
const SET_ALBUM_LOAD = 'SET_ALBUM_LOAD';
const SET_ALBUM_DETAIL = 'SET_ALBUM_DETAIL';
const SET_ALBUM_LIST = 'SET_ALBUM_LIST';
const SET_ALBUM_COMMENT = 'SET_ALBUM_COMMENT';

// mutations
const mutations = {
    [ SET_ALBUM_LOAD ](state, payload) {
        state.load = payload;
    },
    [ SET_ALBUM_DETAIL ](state, payload) {
        const { id, result } = payload;
        const { album, songs } = result;
        if (!state.album[ id ]) state.album[ id ] = {};
        state.album[ id ].detail = album;
        state.album[ id ].songs = songs.map(({ id, name, al, alia, ar }) => {
            return { id, name, alia, artist: ar, album: al };
        });
    },
    [ SET_ALBUM_LIST ](state, payload) {
        const { albums: all, ...props } = payload;
        const date = new Date();
        const day = date.getDay() === 0 ? 7 : date.getDay();
        const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - (day - 1)).getTime();
        const weekEnd = date.getTime();
        const weekAlbums = all.filter(({ publishTime }) => publishTime >= weekStart && publishTime <= weekEnd);
        const monthAlbums = all.filter(({ publishTime }) => publishTime < weekStart);
        let monthAlbumObj = {};
        if (monthAlbums.length) {
            const monthAlbumsSet = new Set(monthAlbums);
            monthAlbumsSet.forEach(({ publishTime }) => {
                const year = new Date(publishTime).getFullYear();
                const month = new Date(publishTime).getMonth() + 1;
                const list = monthAlbums.filter(({ publishTime }) => month === new Date(publishTime).getMonth() + 1);
                const index = year - 9999 + month - 13; // 处理Object.values遍历时顺序问题
                if (!monthAlbumObj[ index ]) monthAlbumObj[ index ] = {};
                monthAlbumObj[ index ].date = { year, month };
                monthAlbumObj[ index ].list = list;
            });
        }
        state.list = {
            albums: [
                { title: '本周新碟', list: weekAlbums },
                ...Object.values(monthAlbumObj)
            ], all, ...props
        };
    },
    [ SET_ALBUM_COMMENT ](state, payload) {
        const { id, ...comment } = payload;
        if (!state.comment[ id ]) state.comment[ id ] = {};
        state.comment[ id ] = comment;
    },
};

// actions
const actions = {
    async setAlbumDetail({ commit, state }, payload) {
        try {
            if (state.album[ payload ]) return;
            const result = await getAlbum(payload);
            await commit(SET_ALBUM_DETAIL, { id: payload, result });
        } catch (e) {
            throw e;
        }
    },
    async setAlbumList({ commit, state }) {
        try {
            if (state.list?.all?.length && !state.list.more) return;
            const offset = state.list?.all?.length || 0;
            if (offset > 0) await commit(SET_ALBUM_LOAD, true);
            let result = await getAlbumList({ offset });
            if (offset > 0) {
                result.albums = state.list.all.concat(result.albums);
            }
            await commit(SET_ALBUM_LOAD, false);
            result.more = result.albums.length < result.total;
            commit(SET_ALBUM_LIST, result);
        } catch (e) {
            throw e;
        }
    },
    async setAlbumComment({ commit, state }, payload) {
        try {
            if (state.comment[ payload ]) return;
            const { more, comments, hotComments, total } = await getAlbumComment(payload);
            await commit(SET_ALBUM_COMMENT, { id: payload, more, comments, hotComments, total });
        } catch (e) {
            throw e;
        }
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
