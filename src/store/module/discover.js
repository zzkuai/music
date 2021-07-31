import { getBanner, getAlbum, getPlaylist, getSong } from '@/api/page/discover';

// state
const state = {
  banner: null,
  album: null,
  playlist: null,
  song: null,
  mv: null,
};

// mutations type
const SET_BANNER = 'SET_BANNER';
const SET_ALBUM = 'SET_ALBUM';
const SET_PLAYLIST = 'SET_PLAYLIST';
const SET_SONG = 'SET_SONG';

// mutations
const mutations = {
  [SET_BANNER](state, payload) {
    state.banner = payload;
  },
  [SET_ALBUM](state, payload) {
    state.album = payload;
  },
  [SET_PLAYLIST](state, payload) {
    state.playlist = payload;
  },
  [SET_SONG](state, payload) {
    state.song = payload;
  },
};

// actions
const actions = {
  async setBanner({ commit, state }) {
    let result = null;
    if (state.banner) {
      result = state.banner;
    } else {
      const { banners } = await getBanner();
      result = banners;
      await commit(SET_BANNER, result);
    }
    return result;
  },
  async setAlbum({ commit, state }) {
    let result = null;
    if (state.album) {
      result = state.album;
    } else {
      const { albums } = await getAlbum();
      result = albums
        .map(({ id, name, artist, picUrl }) => ({
          id,
          name,
          artist,
          url: picUrl,
        }))
        .filter((item, index) => index < 6);
      await commit(SET_ALBUM, result);
    }
    return result;
  },
  async setPlaylist({ commit, state }) {
    let result = null;
    if (state.playlist) {
      result = state.playlist;
    } else {
      const { result: playlist } = await getPlaylist(6);
      result = playlist;
      await commit(SET_PLAYLIST, result);
    }
    return result;
  },
  async setSong({ commit, state }) {
    let result = null;
    if (state.song) {
      result = state.song;
    } else {
      const { result: songs } = await getSong();
      result = songs
        .map(({ song }) => {
          const { id, name, album: al, alias: alia, artists: ar } = song;
          return { id, name, al, alia, ar };
        })
        .filter((item, index) => index < 6);
      await commit(SET_SONG, result);
    }
    return result;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
