import { getHotSearch, getSearch } from '@/api/page/search';
import { searchType, SEARCH_STORAGE_KEY } from '@/config/param';
import { get, set, remove } from '@/util/storage';

// state
const state = {
  keyword: '',
  history: null,
  type: 1,
  hot: null,
  load: false,
  cache: {},
};

// getters
const getters = {
  getSearchResult: (state) => (keyword, type) =>
    state?.cache[`${keyword}${type}`]?.list,
};

// mutations type
const SET_SEARCH_KEYWORD = 'SET_SEARCH_KEYWORD';
const SET_SEARCH_HISTORY = 'SET_SEARCH_HISTORY';
const SET_SEARCH_TYPE = 'SET_SEARCH_TYPE';
const SET_HOT_SEARCH = 'SET_HOT_SEARCH';
const SET_SEARCH = 'SET_SEARCH';
const SET_SEARCH_LOAD = 'SET_SEARCH_LOAD';

// mutations
const mutations = {
  [SET_SEARCH_KEYWORD](state, payload) {
    state.keyword = payload;
  },
  [SET_SEARCH_HISTORY](state, payload) {
    state.history = payload;
  },
  [SET_SEARCH_TYPE](state, payload) {
    state.type = payload;
  },
  [SET_HOT_SEARCH](state, payload) {
    state.hot = payload;
  },
  [SET_SEARCH](state, payload) {
    const { keyword, type, list, count } = payload;
    if (!state.cache[`${keyword}${type}`])
      state.cache[`${keyword}${type}`] = {};
    state.cache[`${keyword}${type}`].list = list;
    state.cache[`${keyword}${type}`].count = count;
  },
  [SET_SEARCH_LOAD](state, payload) {
    state.load = payload;
  },
};

// actions
const actions = {
  async setSearchKeyword({ commit }, payload) {
    await commit(SET_SEARCH_KEYWORD, payload);
  },
  async initSearchHistory({ commit }) {
    const history = (await get(SEARCH_STORAGE_KEY)) || [];
    await commit(SET_SEARCH_HISTORY, history);
  },
  async setSearchHistory({ commit }, payload) {
    const history = (await get(SEARCH_STORAGE_KEY)) || [];
    if (payload && !history.includes(payload)) {
      history.push(payload);
      await set(SEARCH_STORAGE_KEY, history);
      await commit(SET_SEARCH_HISTORY, history);
    }
  },
  async setSearchType({ commit }, payload) {
    await commit(SET_SEARCH_TYPE, payload);
  },
  async setHotSearch({ commit, state }) {
    let result = null;
    if (state.hot) {
      result = state.hot;
    } else {
      const res = await getHotSearch();
      result = res.data;
      await commit(SET_HOT_SEARCH, result);
    }
    return result;
  },
  async setSearch({ commit, state }, payload) {
    const { keyword, type, reload = true } = payload;
    if (state?.cache[`${keyword}${type}`] && reload) return;
    if (state?.cache[`${keyword}${type}`]) {
      const { list, count } = state.cache[`${keyword}${type}`];
      if (list.length < count) {
        await commit(SET_SEARCH_LOAD, true);
        const offset = list.length;
        const { result } = await getSearch(keyword, type, offset);
        const total = list.concat(
          result[`${searchType.find(({ code }) => code === type).type}`]
        );
        await commit(SET_SEARCH_LOAD, false);
        await commit(SET_SEARCH, { keyword, type, list: total, count });
      }
    } else {
      const { result } = await getSearch(keyword, type);
      const list =
        result[`${searchType.find(({ code }) => code === type).type}`];
      const count =
        result[`${searchType.find(({ code }) => code === type).count}`];
      await commit(SET_SEARCH, { keyword, type, list, count });
    }
  },
  async resetSearch({ commit }) {
    await commit(SET_SEARCH_KEYWORD, '');
    await commit(SET_SEARCH_TYPE, 1);
  },
  async removeSearchHistory({ commit }) {
    await remove(SEARCH_STORAGE_KEY);
    await commit(SET_SEARCH_HISTORY, null);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
