import { get } from '@/api/request';
import { playListUrl, playListCatUrl, playListCommentUrl, playListDetailUrl, playListHighUrl } from '@/api/url';

// 歌单列表
export const getPlayList = ({ cat = '全部', offset = 0 }) => get(playListUrl, { cat, offset, limit: 21, order: 'hot' });

// 精品歌单
export const getPlayListHigh = ({ cat = '全部', before }) => get(playListHighUrl, { cat, limit: 21, before });

// 歌单分类
export const getPlayListCat = () => get(playListCatUrl);

// 歌单详情
export const getPlayListDetail = (id) => get(playListDetailUrl, { id });

// 歌单评论
export const getPlayListComment = (id) => get(playListCommentUrl, { id });
