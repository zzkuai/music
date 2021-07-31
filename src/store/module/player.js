import { getSongLink, getLyric } from '@/api/page/song';
import getImageMeanColor from '@/util/color';

// state
const state = {
  playEl: null,
  playInfo: {}, // 当前播放歌曲
  playCache: {}, // 缓存播放歌曲
  playLyric: {}, // 歌词
  playList: [], // 播放列表
  playType: 0, // 0：列表循环 1：随机播放 2：单曲循环
  playHandle: false, // 是否手动拖拉进度条
  playStatus: false,
  playDuration: 0,
  playCurrentTime: 0,
};

// getters
const getters = {
  playId: ({ playInfo }) => playInfo.id,
  playListCount: ({ playList }) => playList.length,
};

// mutations type
const SET_PLAY_EL = 'SET_PLAY_EL';
const SET_PLAY_INFO = 'SET_PLAY_INFO';
const SET_PLAY_CACHE = 'SET_PLAY_CACHE';
const SET_PLAY_LYRIC = 'SET_PLAY_LYRIC';
const SET_PLAY_LIST = 'SET_PLAY_LIST';
const SET_PLAY_TYPE = 'SET_PLAY_TYPE';
const SET_PLAY_HANDLE = 'SET_PLAY_HANDLE';
const SET_PLAY_STATUS = 'SET_PLAY_STATUS';
const SET_PLAY_DURATION = 'SET_PLAY_DURATION';
const SET_PLAY_CURRENT_TIME = 'SET_PLAY_CURRENT_TIME';

// mutations
const mutations = {
  [SET_PLAY_EL](state, payload) {
    state.playEl = payload;
  },
  [SET_PLAY_INFO](state, info) {
    state.playInfo = info;
  },
  [SET_PLAY_CACHE](state, info) {
    state.playCache[info.id] = info;
  },
  [SET_PLAY_LYRIC](state, payload) {
    const { id, lyric } = payload;
    state.playLyric[id] = lyric;
  },
  [SET_PLAY_LIST](state, payload) {
    state.playList = payload;
  },
  [SET_PLAY_TYPE](state, payload) {
    state.playType = payload;
  },
  [SET_PLAY_HANDLE](state, payload) {
    state.playHandle = payload;
  },
  [SET_PLAY_STATUS](state, payload) {
    state.playStatus = payload;
  },
  [SET_PLAY_DURATION](state, payload) {
    state.playDuration = payload;
  },
  [SET_PLAY_CURRENT_TIME](state, payload) {
    state.playCurrentTime = payload;
  },
};

// 获取格式化时间和歌词
const getLyricFormatTimeAndText = function (arr) {
  let result = [];
  let hasRepeat = false;
  arr
    .filter((item) => !!item)
    .forEach((item) => {
      const timeArr = item.match(/\[[\d]+:[\d]+\.[\d]+]/g);
      const textArr = item.split(/\[[\d]+:[\d]+\.[\d]+]/g);
      if (!hasRepeat && timeArr.length > 1) hasRepeat = true;
      timeArr.forEach((time) => {
        let obj = {};
        obj.time = time.match(/\d+:\d+.\d+/)[0];
        obj.text = textArr[textArr.length - 1];
        result.push(obj);
      });
    });
  if (hasRepeat) {
    result.sort((prev, next) => {
      const prevTime = +prev.time.replace(/:/, '').replace(/\./, '');
      const nextTime = +next.time.replace(/:/, '').replace(/\./, '');
      return prevTime - nextTime;
    });
  }
  return result;
};
const getTranslateLyricFormatTimeAndText = function (str) {
  const timeArr = str
    .match(/\[[\d]+:[\d]+\.[\d]+]/g)
    .map((item) => item.match(/\d+:\d+\.\d+/)[0]);
  const textArr = str
    .split(/\[[\d]+:[\d]+\.[\d]+]/g)
    .filter((item, index) => index > 0);
  return { timeArr, textArr };
};

// actions
const actions = {
  async setPlayEl({ commit }, payload) {
    await commit(SET_PLAY_EL, payload);
  },
  async setPlayInfo({ commit, state, dispatch }, song) {
    const { playEl, playCache } = state;
    let url = ''; // 歌曲播放链接
    if (!playCache[song.id]?.url) {
      const { data } = await getSongLink(song.id);
      url = data[0].url;
    } else {
      url = playCache[song.id].url;
    }
    if (!url) throw '获取歌曲失败！';
    playEl.src = url;
    await playEl.play(); // 播放歌曲
    const { name, alia, artist, album } = song;
    const avatar = album.picUrl || album.artist.img1v1Url;
    let color = ''; // 歌曲封面主色
    if (!playCache[song.id]?.color) {
      color = await getImageMeanColor({ imageUrl: `${avatar}?param=10y10` });
    } else {
      color = playCache[song.id].color;
    }
    const info = {
      id: song.id,
      name,
      url,
      alia: (alia && alia[0]) || '',
      album,
      author: artist.map(({ id, name }) => ({ id, name })),
      avatar,
      color,
      duration: playEl.duration,
    };
    await commit(SET_PLAY_INFO, info);
    await commit(SET_PLAY_CACHE, info);
    await commit(SET_PLAY_STATUS, true);
    await commit(SET_PLAY_CURRENT_TIME, 0);
    await dispatch('setPlayDuration', song.id);
  },
  async setPlayLyric({ commit, state }, songId) {
    if (state.playLyric[songId]) {
      return state.playLyric[songId];
    }
    const { lrc, tlyric, nolyric, lyricUser, transUser } = await getLyric(
      songId
    );
    if (nolyric || !lrc) return [];
    const startIndex = lrc?.lyric.search(/\[\d/);
    const lyricArr = lrc?.lyric.substring(startIndex).split(/\n/);
    let lyric = Object.freeze(getLyricFormatTimeAndText(lyricArr));
    if (tlyric?.lyric) {
      // 英语歌词翻译
      const tlyricObj = {};
      const tlyricStr = tlyric?.lyric.substring(startIndex);
      const { timeArr, textArr } =
        getTranslateLyricFormatTimeAndText(tlyricStr);
      timeArr.forEach((item, index) => (tlyricObj[`${item}`] = textArr[index]));
      lyric = lyric.map(({ time, text }) => {
        text += `${
          tlyricObj[time]?.trim() ? `\n${tlyricObj[time].trim()}` : ''
        }`;
        return { time, text };
      });
    }
    lyric = lyric.filter(({ text }) => !!text);
    if (lyricUser) {
      const { nickname } = lyricUser;
      lyric = lyric.concat([{ text: `歌词贡献者：${nickname}` }]);
    }
    if (transUser) {
      const { nickname } = transUser;
      lyric = lyric.concat([{ text: `翻译贡献者：${nickname}` }]);
    }
    await commit(SET_PLAY_LYRIC, { id: songId, lyric });
    return lyric;
  },
  async setPlayList({ commit }, song) {
    await commit(SET_PLAY_LIST, song);
  },
  async setPlayType({ commit }, payload) {
    await commit(SET_PLAY_TYPE, payload);
  },
  async setPlayHandle({ commit }, payload) {
    await commit(SET_PLAY_HANDLE, payload);
  },
  async setPlayStatus({ commit }, payload) {
    await commit(SET_PLAY_STATUS, payload);
  },
  async setPlayCurrentTime({ commit }, payload) {
    await commit(SET_PLAY_CURRENT_TIME, payload);
  },
  async setPlayDuration({ commit, state }, songId) {
    const { playEl, playCache } = state;
    let duration = 0; // 歌曲时长
    if (
      !playCache[songId]?.duration ||
      isNaN(playCache[songId].duration) ||
      playCache[songId].duration < 1
    ) {
      duration = playEl.duration;
      await commit(SET_PLAY_CACHE, { ...playCache[songId], duration });
    } else {
      duration = playCache[songId].duration;
    }
    await commit(SET_PLAY_DURATION, duration);
  },
  async changePlaySong({ state, getters, dispatch }, payload) {
    const { isNext = true, isClick = false, playSongIndex = -1 } = payload;
    const { playEl, playInfo, playType, playList } = state;
    const { playListCount } = getters;
    if (playList.length < 1) return;
    if (playType === 2 && !isClick) {
      // 单曲循环直接播放
      playEl.src = playInfo.url;
      playEl.play();
      return;
    }
    let curIndex = -1;
    if (playSongIndex > -1 && playType !== 1) {
      curIndex = playSongIndex === playListCount ? 0 : playSongIndex;
    } else {
      switch (playType) {
        case 0:
        case 2:
          curIndex = playList.findIndex((val) => val.id === playInfo.id);
          if (isNext) {
            curIndex = curIndex === playList.length - 1 ? 0 : curIndex + 1;
          } else {
            curIndex = curIndex === 0 ? playList.length - 1 : curIndex - 1;
          }
          break;
        case 1:
          curIndex = Math.floor(Math.random() * playList.length);
          break;
      }
    }
    const song = playList.find((val, index) => index === +curIndex);
    await dispatch('setPlayInfo', song);
  },
  async setNextPlaySong({ state, getters, dispatch }, payload) {
    const { song, play = false } = payload;
    const { playList } = state;
    const { playId } = getters;
    if (playList.length < 1) {
      // 播放列表为空添加新歌曲
      await dispatch('setPlayInfo', song);
      await dispatch('setPlayList', [song]);
    } else {
      const playIndex = playList.findIndex(({ id }) => id === playId);
      const songIndex = playList.findIndex(({ id }) => id === song.id);
      if (playIndex + 1 !== songIndex) {
        const totalArr =
          songIndex > -1
            ? playList.filter((item, index) => index !== songIndex)
            : playList;
        const sliceIndex =
          songIndex > -1 && playIndex > songIndex ? playIndex : playIndex + 1;
        const prevArr = totalArr.slice(0, sliceIndex).concat([song]);
        const nextArr = totalArr.slice(sliceIndex);
        if (play) {
          await dispatch('setPlayInfo', song);
        }
        dispatch('setPlayList', prevArr.concat(nextArr));
      }
    }
  },
  async resetPlay({ commit, state }) {
    state.playEl.src = '';
    await commit(SET_PLAY_INFO, {});
    await commit(SET_PLAY_LIST, []);
    await commit(SET_PLAY_STATUS, false);
    await commit(SET_PLAY_CURRENT_TIME, 0);
    await commit(SET_PLAY_DURATION, 0);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
