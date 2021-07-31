// 页面参数7
export const PAGE_WIDTH =
  window.innerWidth || document.documentElement.clientWidth;
export const PAGE_HEIGHT =
  window.innerHeight || document.documentElement.clientHeight;
export const PAGE_DPR = window.devicePixelRatio.toFixed(1);
export const NAV_BAR_HEIGHT = 50;
export const COM_HEADER_HEIGHT = 50;
export const getRelativeSize = (x) => (x * PAGE_WIDTH) / 375;

// 首页导航
export const comNav = [
  { id: 0, text: '发现', path: '/discover' },
  { id: 1, text: '歌手', path: '/singer' },
];

// 搜索分类
export const searchType = [
  {
    name: '单曲',
    code: 1,
    type: 'songs',
    count: 'songCount',
    component: 'SearchSong',
  },
  {
    name: '歌手',
    code: 100,
    type: 'artists',
    count: 'artistCount',
    component: 'SearchSinger',
  },
];
export const SEARCH_STORAGE_KEY = 'music_history';

// 歌手分类
export const singerCat = [
  { name: '入驻歌手', cat: 5001 },
  { name: '华语男', cat: 1001 },
  { name: '华语女', cat: 1002 },
  { name: '华语组合', cat: 1003 },
  { name: '欧美男', cat: 2001 },
  { name: '欧美女', cat: 2002 },
  { name: '欧美组合', cat: 2003 },
  { name: '日本男', cat: 6001 },
  { name: '日本女', cat: 6002 },
  { name: '日本组合 ', cat: 6003 },
  { name: '韩国男', cat: 7001 },
  { name: '韩国女', cat: 7002 },
  { name: '韩国组合', cat: 7003 },
];

// 播放类型
export const playType = {
  0: {
    icon: 'loop',
    sizeBig: 'size-ll',
    sizeSmall: 'size-mg',
    text: '列表循环',
  },
  1: {
    icon: 'random',
    sizeBig: 'size-mg',
    sizeSmall: 'size-sm',
    text: '随机播放',
  },
  2: {
    icon: 'single',
    sizeBig: 'size-gg',
    sizeSmall: 'size-md',
    text: '单曲循环',
  },
};
