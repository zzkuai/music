import {
  getTopArtist,
  getArtistList,
  getArtist,
  getArtistSong,
  getArtistAlbum,
  getArtistMV,
  getArtistDesc,
  getArtistAvatar,
} from '@/api/page/singer';

// state
const state = {
  hot: {
    more: true,
    artists: [],
  },
  list: {},
  artist: {},
  avatar: {},
  load: false, // 处理加载更多数据
};

// getters
const getters = {
  getSingerDetailById:
    ({ artist }) =>
    (id) =>
      artist[id].detail,
  getSingerSongById:
    ({ artist }) =>
    (id) =>
      artist[id].song,
  getSingerAlbumById:
    ({ artist }) =>
    (id) =>
      artist[id].album,
  getSingerMVById:
    ({ artist }) =>
    (id) =>
      artist[id].mv,
  getSingerAvatarById:
    ({ avatar }) =>
    (id) =>
      avatar[id],
};

// mutations type
const SET_SINGER_HOT_LIST = 'SET_SINGER_HOT_LIST';
const SET_SINGER_LIST = 'SET_SINGER_LIST';
const SET_SINGER_DETAIL = 'SET_SINGER_DETAIL';
const SET_SINGER_AVATAR = 'SET_SINGER_AVATAR';
const SET_SINGER_SONG = 'SET_SINGER_SONG';
const SET_SINGER_ALBUM = 'SET_SINGER_ALBUM';
const SET_SINGER_MV = 'SET_SINGER_MV';
const SET_SINGER_PROFILE = 'SET_SINGER_PROFILE';
const SET_SINGER_LOAD = 'SET_SINGER_LOAD';

// mutations
const mutations = {
  [SET_SINGER_HOT_LIST](state, payload) {
    state.hot = payload;
  },
  [SET_SINGER_LIST](state, payload) {
    state.list[payload.cat] = payload.result;
  },
  [SET_SINGER_DETAIL]({ artist }, payload) {
    const { singerId, detail } = payload;
    if (!artist[singerId]) artist[singerId] = {};
    artist[singerId].detail = detail;
  },
  [SET_SINGER_AVATAR]({ avatar }, payload) {
    const { singerId, picUrl } = payload;
    avatar[singerId] = picUrl;
  },
  [SET_SINGER_SONG]({ artist }, payload) {
    const { singerId, song } = payload;
    artist[singerId].song = song.map(({ id, name, al, alia, ar }) => {
      return { id, name, alia, artist: ar, album: al };
    });
  },
  [SET_SINGER_ALBUM]({ artist }, payload) {
    const { singerId, album } = payload;
    artist[singerId].album = album;
  },
  [SET_SINGER_MV]({ artist }, payload) {
    const { singerId, mv } = payload;
    artist[singerId].mv = mv;
  },
  [SET_SINGER_PROFILE]({ artist }, payload) {
    const { singerId, profile } = payload;
    artist[singerId].profile = profile;
  },
  [SET_SINGER_LOAD](state, payload) {
    state.load = payload;
  },
};

// actions
const actions = {
  async setSingerHotList({ commit, state }) {
    if (!state.hot.more) return;
    let offset = state.hot.artists.length || 0;
    if (offset > 0) await commit(SET_SINGER_LOAD, true);
    let result = await getTopArtist({ offset });
    if (offset > 0) {
      result.artists = state.hot.artists.concat(result.artists);
    }
    if (state.load) await commit(SET_SINGER_LOAD, false);
    await commit(SET_SINGER_HOT_LIST, Object.freeze(result));
  },
  async setSingerList({ commit, state }, payload) {
    if (!state.list[payload.cat]) {
      await commit(SET_SINGER_LIST, {
        cat: payload.cat,
        result: { more: true, artists: [] },
      });
    }
    if (!state.list[payload.cat].more) return;
    let offset = state.list[payload.cat].artists.length || 0;
    if (offset > 0) await commit(SET_SINGER_LOAD, true);
    let result = await getArtistList({ offset, ...payload });
    if (offset > 0) {
      result.artists = state.list[payload.cat].artists.concat(result.artists);
    }
    if (state.load) await commit(SET_SINGER_LOAD, false);
    await commit(SET_SINGER_LIST, {
      cat: payload.cat,
      result: Object.freeze(result),
    });
  },
  async setSingerDetail({ commit, state }, singerId) {
    if (state.artist[singerId]?.detail) return;
    const { artist } = await getArtist(singerId);
    await commit(SET_SINGER_DETAIL, { singerId, detail: artist });
  },
  async setSingerAvatar({ commit, state }, singerId) {
    if (state.avatar[singerId]) return;
    const { picUrl } = await getArtistAvatar(singerId);
    commit('SET_SINGER_AVATAR', { singerId, picUrl });
  },
  async setSingerSong({ commit, state }, singerId) {
    if (state.artist[singerId]?.song) return;
    const { songs } = await getArtistSong(singerId);
    await commit(SET_SINGER_SONG, { singerId, song: songs });
  },
  async setSingerAlbum({ commit, state }, singerId) {
    if (!state.artist[singerId]?.album) {
      await commit(SET_SINGER_ALBUM, {
        singerId,
        album: { list: [], more: true },
      });
    }
    if (!state.artist[singerId].album.more) return;
    let offset = state.artist[singerId].album.list.length || 0;
    if (offset > 0) await commit(SET_SINGER_LOAD, true);
    let result = await getArtistAlbum(singerId, { offset });
    if (offset > 0) {
      result.albums = state.artist[singerId].album.list.concat(result.albums);
    }
    if (state.load) await commit(SET_SINGER_LOAD, false);
    await commit(SET_SINGER_ALBUM, {
      singerId,
      album: { list: result.albums, more: result.more },
    });
  },
  async setSingerMV({ commit, state }, singerId) {
    if (!state.artist[singerId]?.mv) {
      await commit(SET_SINGER_MV, { singerId, mv: { list: [], more: true } });
    }
    if (!state.artist[singerId].mv.more) return;
    let offset = state.artist[singerId].mv.list.length || 0;
    if (offset > 0) await commit(SET_SINGER_LOAD, true);
    let result = await getArtistMV(singerId, { offset });
    if (offset > 0) {
      result.mvs = state.artist[singerId].mv.list.concat(result.mvs);
    }
    if (state.load) await commit(SET_SINGER_LOAD, false);
    await commit(SET_SINGER_MV, {
      singerId,
      mv: { list: result.mvs, more: result.hasMore },
    });
  },
  async setSingerProfile({ commit, state }, singerId) {
    let result = null;
    if (state.artist[singerId]?.profile) {
      result = state.artist[singerId].profile;
    } else {
      const profile = await getArtistDesc(singerId);
      result = profile;
      commit(SET_SINGER_PROFILE, { singerId, profile });
    }
    return result;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
