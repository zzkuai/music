import { songDetailUrl, songLinkUrl, lyricUrl, songCheckUrl } from '@/api/url';
import { get } from '@/api/request';

// 音乐是否可用
export const checkSong = (id) => get(songCheckUrl, { id });

// 歌曲详情
export const getSongDetail = (ids) => get(songDetailUrl, { ids });

// 音乐url
export const getSongLink = (id) => get(songLinkUrl, { id });

// 歌词
export const getLyric = (id) => get(lyricUrl, { id });

